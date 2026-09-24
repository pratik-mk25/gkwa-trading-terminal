#!/usr/bin/env python3
"""
GKWA Trading Terminal - Autonomous Quant Agent Swarm Worker
Reads real-time market data, calculates open-source quantitative formulas,
and executes trades via the sandbox execution API (/api/sandbox/act).
"""

import sys
import os
import json
import time
import argparse
import urllib.request
import urllib.error

# ANSI Color Codes for terminal formatting
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"

class SwarmWorkerClient:
    def __init__(self, base_url: str, dry_run: bool = False):
        self.base_url = base_url.rstrip("/")
        self.dry_run = dry_run
        self.cycle_count = 0

    def fetch_state(self) -> dict:
        url = f"{self.base_url}/api/sandbox/state"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*"
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as response:
            return json.loads(response.read().decode("utf-8"))

    def send_action(self, payload: dict) -> dict:
        if self.dry_run:
            print(f"{YELLOW}[DRY-RUN]{RESET} Would post action: {payload['action']} {payload.get('qty', 10)} {payload['symbol']} ({payload.get('reason', '')})")
            return {"status": "DRY_RUN", "payload": payload}

        url = f"{self.base_url}/api/sandbox/act"
        data = json.dumps(payload).encode("utf-8")
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*"
        }
        req = urllib.request.Request(url, data=data, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=5) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            return {"status": "ERROR", "code": e.code, "message": e.read().decode("utf-8")}
        except Exception as e:
            return {"status": "ERROR", "message": str(e)}

    def run_quant_strategies(self, state: dict):
        """
        Executes open-source quantitative decision formulas across all 4 subagents.
        """
        mdata = state.get("market_data", {})
        telemetry = state.get("swarm_telemetry", {})
        active_positions = telemetry.get("active_positions", [])
        active_syms = {p["symbol"].upper() for p in active_positions}

        # ------------------------------------------------------------------
        # Agent 1: Options Delta-Neutral Bot (Black-Scholes Delta Tracking)
        # ------------------------------------------------------------------
        opts = mdata.get("options_trades", [])
        if opts:
            net_delta = sum(float(p.get("delta", 0.5)) * (1 if p.get("action") == "BUY" else -1) for p in active_positions if "CE" in p["symbol"] or "PE" in p["symbol"])
            # If delta imbalance exceeds 1.5, hedge with an offsetting option
            if abs(net_delta) > 1.5 or len(active_positions) < 3:
                target_opt = next((o for o in opts if o.get("STATUS") == "ACTIVE" and o["SYMBOL"] not in active_syms), None)
                if target_opt:
                    receipt = self.send_action({
                        "agent_id": "options_greeks_02",
                        "action": "BUY",
                        "symbol": target_opt["SYMBOL"],
                        "price": target_opt["LTP"],
                        "qty": 50,
                        "sl": round(target_opt["LTP"] * 0.75, 1),
                        "target": round(target_opt["LTP"] * 1.5, 1),
                        "reason": f"Delta Neutral Hedging: Delta {target_opt.get('DELTA', 0.5)} Gamma {target_opt.get('GAMMA', 0.001)}"
                    })
                    if receipt.get("status") == "FILLED":
                        active_syms.add(target_opt["SYMBOL"].upper())

        # ------------------------------------------------------------------
        # Agent 2: Alpha Momentum Scalper (ADX + Camarilla H4 Breakout)
        # ------------------------------------------------------------------
        bullets = mdata.get("day_trader_bullets", [])
        if bullets and len(active_positions) < 5:
            bullish_cand = next((b for b in bullets if b.get("ACTION") == "BUY" and b["SYMBOL"] not in active_syms), None)
            if bullish_cand:
                C = bullish_cand["LTP"]
                self.send_action({
                    "agent_id": "alpha_momentum_01",
                    "action": "BUY",
                    "symbol": bullish_cand["SYMBOL"],
                    "qty": max(5, int(15000 / max(C, 1))),
                    "sl": bullish_cand.get("SL", round(C * 0.985, 1)),
                    "target": bullish_cand.get("T2", round(C * 1.03, 1)),
                    "reason": f"Alpha Momentum: Camarilla H4 Breakout (+{bullish_cand.get('SCORE', 3)}/5)"
                })
                active_syms.add(bullish_cand["SYMBOL"].upper())

        # ------------------------------------------------------------------
        # Agent 3: Sector Rotation Arbitrageur (17 Sectors Divergence)
        # ------------------------------------------------------------------
        sectors = mdata.get("sectors", [])
        if sectors and len(active_positions) < 6:
            sorted_sectors = sorted(sectors, key=lambda s: s.get("change_pct", 0), reverse=True)
            top_sec = sorted_sectors[0]
            if top_sec.get("change_pct", 0) > 0.3:
                # Target constituent
                intraday = mdata.get("intraday_trades", [])
                sec_trade = next((t for t in intraday if t["SYMBOL"] not in active_syms and t.get("ALERT") == "LONG"), None)
                if sec_trade:
                    C = sec_trade["RECENT_VALUE"]
                    self.send_action({
                        "agent_id": "sector_divergence_03",
                        "action": "BUY",
                        "symbol": sec_trade["SYMBOL"],
                        "qty": max(5, int(15000 / max(C, 1))),
                        "sl": sec_trade.get("SL", round(C * 0.98, 1)),
                        "target": sec_trade.get("T1", round(C * 1.025, 1)),
                        "reason": f"Sector Arbitrage: Outperforming Sector '{top_sec.get('sector_name')}' (+{top_sec.get('change_pct')}%)"
                    })
                    active_syms.add(sec_trade["SYMBOL"].upper())

        # ------------------------------------------------------------------
        # Agent 4: Pivot Breakout Sentinel (CPR Compression & Extension)
        # ------------------------------------------------------------------
        if len(active_positions) < 6:
            intraday = mdata.get("intraday_trades", [])
            pivot_trade = next((t for t in intraday if t.get("STATUS") == "ACTIVE" and t["SYMBOL"] not in active_syms), None)
            if pivot_trade:
                C = pivot_trade["RECENT_VALUE"]
                act = pivot_trade.get("ALERT", "BUY")
                self.send_action({
                    "agent_id": "cpr_camarilla_sentinel_04",
                    "action": act,
                    "symbol": pivot_trade["SYMBOL"],
                    "qty": max(5, int(15000 / max(C, 1))),
                    "sl": pivot_trade.get("SL", round(C * 0.985, 1)),
                    "target": pivot_trade.get("T1", round(C * 1.025, 1)),
                    "reason": f"CPR Central Range Expansion: {pivot_trade.get('STRATEGY_CODE', 'PIVOT-1')}"
                })

    def display_dashboard(self, state: dict):
        self.cycle_count += 1
        telemetry = state.get("swarm_telemetry", {})
        now_ts = state.get("server_time", time.strftime("%Y-%m-%d %H:%M:%S"))
        net_pnl = telemetry.get("net_swarm_pnl", 0.0)
        pnl_color = GREEN if net_pnl >= 0 else RED

        os.system("cls" if os.name == "nt" else "clear")
        print(f"{CYAN}{BOLD}========================================================================{RESET}")
        print(f"{CYAN}{BOLD}   GKWA TRADING TERMINAL - AUTONOMOUS QUANT AGENT SWARM (CYCLE #{self.cycle_count}){RESET}")
        print(f"{CYAN}{BOLD}========================================================================{RESET}")
        print(f"Time: {now_ts} | Host: {self.base_url} | Mode: {'DRY RUN' if self.dry_run else 'ACTIVE EXECUTION'}")
        print(f"Net Swarm P&L: {pnl_color}{BOLD}₹{net_pnl:,.2f}{RESET} (Realized: ₹{telemetry.get('total_realized_pnl', 0.0):,.2f} | Unrealized: ₹{telemetry.get('total_unrealized_pnl', 0.0):,.2f})")
        print(f"{CYAN}------------------------------------------------------------------------{RESET}")

        print(f"{BOLD}ACTIVE AGENTS IN ROSTER:{RESET}")
        for ag in telemetry.get("agents", []):
            win_r = ag.get("win_rate", 70.0)
            print(f" • {ag['name']:<28} | Role: {ag['role']:<18} | Win Rate: {win_r:>5.1f}% | Trades: {ag['trades_count']}")

        print(f"\n{BOLD}ACTIVE OPEN POSITIONS ({len(telemetry.get('active_positions', []))}):{RESET}")
        positions = telemetry.get("active_positions", [])
        if not positions:
            print("  (No active positions currently open)")
        else:
            print(f"  {'ID':<4} {'SYMBOL':<22} {'ACTION':<6} {'QTY':<5} {'ENTRY':<10} {'LTP':<10} {'UNREALIZED P&L'}")
            for p in positions:
                p_pnl = p.get("unrealized_pnl", 0.0)
                c = GREEN if p_pnl >= 0 else RED
                print(f"  #{p.get('position_id', '-'):<3} {p.get('symbol', ''):<22} {p.get('action', ''):<6} {p.get('qty', 0):<5} ₹{p.get('entry_price', 0.0):<9.2f} ₹{p.get('current_price', 0.0):<9.2f} {c}₹{p_pnl:,.2f}{RESET}")

        print(f"\n{BOLD}RECENT EXECUTION AUDIT LOG:{RESET}")
        actions = telemetry.get("recent_actions", [])[-5:]
        for act in actions:
            act_c = GREEN if act.get("action") in ("BUY", "LONG") else (RED if act.get("action") in ("SELL", "SHORT") else YELLOW)
            print(f"  [{act.get('timestamp', '')[11:]}] {act_c}{act.get('action', ''):<6}{RESET} {act.get('symbol', ''):<20} | {act.get('reason', '')}")
        print(f"{CYAN}========================================================================{RESET}\n")

def main():
    parser = argparse.ArgumentParser(description="GKWA Autonomous Quant Agent Swarm Worker")
    parser.add_argument("--url", default=os.environ.get("GKWA_TERMINAL_URL", "http://127.0.0.1:8000"), help="Terminal sandbox API base URL")
    parser.add_argument("--interval", type=float, default=2.0, help="Seconds between execution cycles (default: 2.0)")
    parser.add_argument("--iterations", type=int, default=0, help="Max iterations (0 = infinite loop)")
    parser.add_argument("--dry-run", action="store_true", help="Print decisions without routing orders")
    parser.add_argument("--once", action="store_true", help="Run a single cycle and exit")
    args = parser.parse_args()

    client = SwarmWorkerClient(base_url=args.url, dry_run=args.dry_run)
    print(f"Connecting to GKWA Trading Terminal Sandbox at {args.url} ...")

    max_iter = 1 if args.once else args.iterations
    count = 0

    try:
        while True:
            count += 1
            try:
                state = client.fetch_state()
                client.run_quant_strategies(state)
                # Re-fetch state for updated telemetry
                state = client.fetch_state()
                client.display_dashboard(state)
            except urllib.error.URLError as e:
                print(f"{RED}[CONNECTION ERROR]{RESET} Could not connect to {args.url}: {e.reason}")
                print("Make sure the GKWA server is running (`uvicorn app.main:app --port 8000`). Retrying in 3s...")
            except Exception as e:
                print(f"{RED}[ERROR]{RESET} Unexpected failure: {e}")

            if max_iter > 0 and count >= max_iter:
                print(f"Finished {count} cycle(s). Exiting worker.")
                break

            time.sleep(args.interval)

    except KeyboardInterrupt:
        print("\nAgent swarm worker terminated by user. Goodbye.")

if __name__ == "__main__":
    main()
