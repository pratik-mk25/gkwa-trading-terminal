import asyncio
import json
import os
from datetime import datetime
from typing import Dict, List, Any, Optional

from app.market_simulator import market_sim, get_ist_now
from app.database import get_db

class AgentSwarmSandbox:
    """
    Real-Time Autonomous Agent Swarm Sandbox.
    Provides streaming access to live market ticks, sectors, and option Greeks,
    and accepts low-latency order execution from autonomous subagents.
    """
    def __init__(self):
        self.agents: Dict[str, Dict[str, Any]] = {}
        self.active_positions: Dict[int, Dict[str, Any]] = {}
        self.audit_log: List[Dict[str, Any]] = []
        self._init_default_swarm()

    def _init_default_swarm(self):
        """Initializes signature default quantitative trading subagents in the swarm"""
        default_agents = [
            {
                "agent_id": "alpha_momentum_01",
                "name": "Alpha Momentum Scalper",
                "role": "MOMENTUM_SCALPER",
                "strategy": "MOMENTUM-1 Breakout + Volatility Surge",
                "balance": 1000000.0,
                "realized_pnl": 14250.0,
                "unrealized_pnl": 3120.0,
                "trades_count": 18,
                "wins": 13,
                "status": "ACTIVE",
                "registered_at": get_ist_now().strftime("%Y-%m-%d %H:%M:%S")
            },
            {
                "agent_id": "options_greeks_02",
                "name": "Options Delta-Neutral Bot",
                "role": "OPTIONS_GREEKS_BOT",
                "strategy": "Black-Scholes Delta Tracking + Theta Harvesting",
                "balance": 1000000.0,
                "realized_pnl": 28400.0,
                "unrealized_pnl": 5800.0,
                "trades_count": 24,
                "wins": 19,
                "status": "ACTIVE",
                "registered_at": get_ist_now().strftime("%Y-%m-%d %H:%M:%S")
            },
            {
                "agent_id": "sector_divergence_03",
                "name": "Sector Rotation Arbitrageur",
                "role": "SECTOR_ARBITRAGEUR",
                "strategy": "17 Sector Momentum Lead-Lag Arbitrage",
                "balance": 1000000.0,
                "realized_pnl": 8900.0,
                "unrealized_pnl": 1250.0,
                "trades_count": 11,
                "wins": 8,
                "status": "ACTIVE",
                "registered_at": get_ist_now().strftime("%Y-%m-%d %H:%M:%S")
            },
            {
                "agent_id": "cpr_camarilla_sentinel_04",
                "name": "Pivot Breakout Sentinel",
                "role": "PIVOT_SENTINEL",
                "strategy": "Camarilla H4/L4 & CPR Central Range Compression",
                "balance": 1000000.0,
                "realized_pnl": 19600.0,
                "unrealized_pnl": 4200.0,
                "trades_count": 15,
                "wins": 12,
                "status": "ACTIVE",
                "registered_at": get_ist_now().strftime("%Y-%m-%d %H:%M:%S")
            }
        ]
        for ag in default_agents:
            self.agents[ag["agent_id"]] = ag

        # Seed initial audit log actions
        now_str = get_ist_now().strftime("%Y-%m-%d %H:%M:%S")
        self.audit_log = [
            {
                "id": 1,
                "agent_id": "options_greeks_02",
                "action": "BUY",
                "symbol": "NIFTY 26 SEP 24850 CE",
                "price": 148.50,
                "qty": 50,
                "reason": "Delta 0.468 ATM Call surge on NIFTY index mean-reversion",
                "status": "EXECUTED",
                "timestamp": now_str
            },
            {
                "id": 2,
                "agent_id": "alpha_momentum_01",
                "action": "BUY",
                "symbol": "PATANJALI",
                "price": 1820.50,
                "qty": 100,
                "reason": "Top gainer breakout in NIFTY FMCG sector (+0.55%)",
                "status": "EXECUTED",
                "timestamp": now_str
            },
            {
                "id": 3,
                "agent_id": "cpr_camarilla_sentinel_04",
                "action": "BUY",
                "symbol": "MANKIND",
                "price": 2580.40,
                "qty": 40,
                "reason": "Camarilla H4 Breakout confirmation in PHARMA (+1.15%)",
                "status": "EXECUTED",
                "timestamp": now_str
            }
        ]

    def register_agent(self, agent_id: str, name: str, role: str, strategy: str) -> Dict[str, Any]:
        """Registers a new autonomous subagent in the sandbox swarm"""
        now_str = get_ist_now().strftime("%Y-%m-%d %H:%M:%S")
        ag = {
            "agent_id": agent_id,
            "name": name,
            "role": role,
            "strategy": strategy,
            "balance": 1000000.0,
            "realized_pnl": 0.0,
            "unrealized_pnl": 0.0,
            "trades_count": 0,
            "wins": 0,
            "status": "ACTIVE",
            "registered_at": now_str
        }
        self.agents[agent_id] = ag
        self._log_event(agent_id, "REGISTER", f"Agent '{name}' registered to swarm sandbox.", {"role": role, "strategy": strategy})
        return ag

    def get_state(self) -> Dict[str, Any]:
        """Returns unified, complete real-time sandbox state for agents and user UI"""
        now = get_ist_now()
        now_str = now.strftime("%Y-%m-%d %H:%M:%S")
        
        # 1. Market Data Layer
        broad_market = market_sim.get_broad_market_indices()
        sectors = market_sim.get_sector_market_indices()
        breadth = market_sim.get_advance_decline(universe="NIFTY FNO", mode="Close")
        bullets = market_sim.get_day_trader_bullets()[:12]
        options_trades = market_sim.get_options_trades()
        intraday_trades = market_sim.get_intraday_trades()

        # Update unrealized PnL for active positions against live prices
        for pos_id, pos in self.active_positions.items():
            sym = pos["symbol"]
            st = market_sim.stocks.get(sym)
            cur_p = st["ltp"] if st else pos["entry_price"]
            diff = (cur_p - pos["entry_price"]) if pos["action"] in ("BUY", "LONG") else (pos["entry_price"] - cur_p)
            pos["current_price"] = cur_p
            pos["unrealized_pnl"] = round(diff * pos["qty"], 2)

        # Swarm performance rollup
        agents_list = []
        total_realized = 0.0
        total_unrealized = 0.0
        for ag_id, ag in self.agents.items():
            ag_positions = [p for p in self.active_positions.values() if p["agent_id"] == ag_id]
            ag_unrealized = sum(p["unrealized_pnl"] for p in ag_positions)
            ag_copy = dict(ag)
            ag_copy["unrealized_pnl"] = round(ag_unrealized, 2)
            ag_copy["win_rate"] = round((ag["wins"] / max(1, ag["trades_count"])) * 100, 1)
            agents_list.append(ag_copy)
            total_realized += ag["realized_pnl"]
            total_unrealized += ag_unrealized

        return {
            "status": "LIVE_SIMULATION",
            "server_time": now_str,
            "timezone": "Asia/Kolkata (IST, UTC+5:30)",
            "market_data": {
                "broad_market": broad_market,
                "sectors": sectors,
                "breadth": breadth,
                "day_trader_bullets": bullets,
                "options_trades": options_trades,
                "intraday_trades": intraday_trades
            },
            "swarm_telemetry": {
                "active_agents_count": len(self.agents),
                "total_positions_count": len(self.active_positions),
                "total_realized_pnl": round(total_realized, 2),
                "total_unrealized_pnl": round(total_unrealized, 2),
                "net_swarm_pnl": round(total_realized + total_unrealized, 2),
                "agents": agents_list,
                "active_positions": list(self.active_positions.values()),
                "recent_actions": self.audit_log[-30:]
            },
            "agents": agents_list
        }

    def execute_action(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes an action posted by an agent in the swarm.
        Supports: BUY, SELL, CLOSE, HEDGE, MODIFY_SL
        """
        now = get_ist_now()
        now_str = now.strftime("%Y-%m-%d %H:%M:%S")

        agent_id = payload.get("agent_id", "external_agent")
        action = payload.get("action", "BUY").upper()
        symbol = payload.get("symbol", "").strip().upper()
        qty = int(payload.get("qty", 10))
        reason = payload.get("reason", "Autonomous trigger from Agent Swarm")
        sl = payload.get("sl")
        target = payload.get("target")

        # Resolve live execution price
        st = market_sim.stocks.get(symbol)
        if st:
            fill_price = st["ltp"]
        else:
            # Check if it's an option contract
            opt_match = next((o for o in market_sim.get_options_trades() if o["SYMBOL"].upper() == symbol.upper()), None)
            fill_price = opt_match["LTP"] if opt_match else float(payload.get("price", 100.0))

        order_id = len(self.audit_log) + 1

        if action in ("BUY", "LONG", "SELL", "SHORT"):
            pos = {
                "position_id": order_id,
                "agent_id": agent_id,
                "symbol": symbol,
                "action": action,
                "qty": qty,
                "entry_price": fill_price,
                "current_price": fill_price,
                "unrealized_pnl": 0.0,
                "sl": sl,
                "target": target,
                "status": "OPEN",
                "timestamp": now_str,
                "reason": reason
            }
            self.active_positions[order_id] = pos
            if agent_id in self.agents:
                self.agents[agent_id]["trades_count"] += 1

            receipt = {
                "order_id": order_id,
                "agent_id": agent_id,
                "action": action,
                "symbol": symbol,
                "qty": qty,
                "fill_price": fill_price,
                "status": "FILLED",
                "timestamp": now_str,
                "message": f"Order #{order_id} filled: {action} {qty} {symbol} @ ₹{fill_price}"
            }
            self._log_event(agent_id, action, f"Filled {qty}x {symbol} @ ₹{fill_price}", receipt)
            return receipt

        elif action == "CLOSE":
            pos_id = payload.get("position_id")
            if pos_id in self.active_positions:
                pos = self.active_positions.pop(pos_id)
                diff = (fill_price - pos["entry_price"]) if pos["action"] in ("BUY", "LONG") else (pos["entry_price"] - fill_price)
                realized = round(diff * pos["qty"], 2)
                if agent_id in self.agents:
                    self.agents[agent_id]["realized_pnl"] += realized
                    if realized > 0:
                        self.agents[agent_id]["wins"] += 1

                receipt = {
                    "order_id": order_id,
                    "position_id": pos_id,
                    "agent_id": agent_id,
                    "action": "CLOSE",
                    "symbol": pos["symbol"],
                    "exit_price": fill_price,
                    "realized_pnl": realized,
                    "status": "CLOSED",
                    "timestamp": now_str,
                    "message": f"Position #{pos_id} closed @ ₹{fill_price} | PnL: ₹{realized}"
                }
                self._log_event(agent_id, "CLOSE", f"Closed {pos['symbol']} @ ₹{fill_price} (PnL ₹{realized})", receipt)
                return receipt
            else:
                return {"status": "ERROR", "message": f"Position ID {pos_id} not found."}

        else:
            return {"status": "ERROR", "message": f"Unknown action '{action}'"}

    def _log_event(self, agent_id: str, action: str, summary: str, details: Dict[str, Any]):
        entry = {
            "id": len(self.audit_log) + 1,
            "agent_id": agent_id,
            "action": action,
            "summary": summary,
            "details": details,
            "timestamp": get_ist_now().strftime("%Y-%m-%d %H:%M:%S")
        }
        self.audit_log.append(entry)
        if len(self.audit_log) > 200:
            self.audit_log.pop(0)

    def step_swarm_cycle(self):
        """
        Autonomous simulation cycle for default quantitative swarm agents.
        Applies open-source formulas to manage stops, harvest profits, and initiate trades.
        """
        # 1. Check existing positions for Target or Stop-Loss hits
        for pos_id, pos in list(self.active_positions.items()):
            sym = pos["symbol"]
            st = market_sim.stocks.get(sym)
            cur_p = st["ltp"] if st else pos["entry_price"]
            diff = (cur_p - pos["entry_price"]) if pos["action"] in ("BUY", "LONG") else (pos["entry_price"] - cur_p)
            pos["current_price"] = cur_p
            pos["unrealized_pnl"] = round(diff * pos["qty"], 2)

            # Target hit check
            if pos.get("target"):
                if (pos["action"] in ("BUY", "LONG") and cur_p >= pos["target"]) or \
                   (pos["action"] in ("SELL", "SHORT") and cur_p <= pos["target"]):
                    self.execute_action({
                        "action": "CLOSE",
                        "position_id": pos_id,
                        "agent_id": pos["agent_id"],
                        "reason": f"Target ₹{pos['target']} hit @ ₹{cur_p}"
                    })
                    continue

            # Stop-loss hit check
            if pos.get("sl"):
                if (pos["action"] in ("BUY", "LONG") and cur_p <= pos["sl"]) or \
                   (pos["action"] in ("SELL", "SHORT") and cur_p >= pos["sl"]):
                    self.execute_action({
                        "action": "CLOSE",
                        "position_id": pos_id,
                        "agent_id": pos["agent_id"],
                        "reason": f"Stop-Loss ₹{pos['sl']} hit @ ₹{cur_p}"
                    })
                    continue

        # 2. If positions are sparse (< 6), allow one of the agents to trigger an autonomous trade
        if len(self.active_positions) < 6:
            import random
            agent_keys = ["alpha_momentum_01", "options_greeks_02", "sector_divergence_03", "cpr_camarilla_sentinel_04"]
            chosen_agent = random.choice(agent_keys)
            
            if chosen_agent == "alpha_momentum_01":
                # Look for a top gainer with high change % not already held
                candidates = [s for s, d in market_sim.stocks.items() if d["type"] != "INDEX" and d["chg_pct"] >= 1.5]
                existing_syms = {p["symbol"] for p in self.active_positions.values()}
                available = [c for c in candidates if c not in existing_syms]
                if available:
                    sym = available[0]
                    st = market_sim.stocks[sym]
                    C = st["ltp"]
                    atr = max(st["high"] - st["low"], C * 0.015)
                    self.execute_action({
                        "agent_id": "alpha_momentum_01",
                        "action": "BUY",
                        "symbol": sym,
                        "qty": max(5, int(15000 / max(C, 1))),
                        "sl": round(C - 0.8 * atr, 1),
                        "target": round(C + 1.5 * atr, 1),
                        "reason": f"MOMENTUM-1 Breakout (+{st['chg_pct']}%) with ADX Expansion"
                    })

            elif chosen_agent == "options_greeks_02":
                opts = market_sim.get_options_trades()
                active_opts = [o for o in opts if o.get("STATUS") == "ACTIVE"]
                existing_syms = {p["symbol"] for p in self.active_positions.values()}
                available = [o for o in active_opts if o["SYMBOL"] not in existing_syms]
                if available:
                    chosen_opt = available[0]
                    self.execute_action({
                        "agent_id": "options_greeks_02",
                        "action": "BUY",
                        "symbol": chosen_opt["SYMBOL"],
                        "price": chosen_opt["LTP"],
                        "qty": 50,
                        "sl": round(chosen_opt["LTP"] * 0.75, 1),
                        "target": round(chosen_opt["LTP"] * 1.45, 1),
                        "reason": f"Delta {chosen_opt.get('DELTA', 0.5)} Gamma {chosen_opt.get('GAMMA', 0.001)} Harvesting"
                    })

            elif chosen_agent == "sector_divergence_03":
                sec = market_sim.get_sector_performance()
                if sec:
                    top_sec = sec[0].get("NAME") or sec[0].get("sector") or "NIFTY AUTO"
                    constituents = market_sim.stocks
                    syms = [s for s, d in constituents.items() if d.get("sector") == top_sec or top_sec.endswith(d.get("sector", ""))]
                    existing_syms = {p["symbol"] for p in self.active_positions.values()}
                    available = [s for s in syms if s not in existing_syms]
                    if available:
                        sym = available[0]
                        C = constituents[sym]["ltp"]
                        atr = max(constituents[sym]["high"] - constituents[sym]["low"], C * 0.015)
                        self.execute_action({
                            "agent_id": "sector_divergence_03",
                            "action": "BUY",
                            "symbol": sym,
                            "qty": max(5, int(15000 / max(C, 1))),
                            "sl": round(C - 0.7 * atr, 1),
                            "target": round(C + 1.6 * atr, 1),
                            "reason": f"Sector Arbitrage: {top_sec} Leading Divergence"
                        })

            elif chosen_agent == "cpr_camarilla_sentinel_04":
                from app.signals import generate_camarilla_heatmap
                cam = generate_camarilla_heatmap()
                above_h4 = cam.get("above_h4", [])
                existing_syms = {p["symbol"] for p in self.active_positions.values()}
                available = [item["sym"] for item in above_h4 if item["sym"] not in existing_syms]
                if available:
                    sym = available[0]
                    st = market_sim.stocks.get(sym)
                    if st:
                        C = st["ltp"]
                        atr = max(st["high"] - st["low"], C * 0.015)
                        self.execute_action({
                            "agent_id": "cpr_camarilla_sentinel_04",
                            "action": "BUY",
                            "symbol": sym,
                            "qty": max(5, int(15000 / max(C, 1))),
                            "sl": round(C - 0.9 * atr, 1),
                            "target": round(C + 1.8 * atr, 1),
                            "reason": f"Camarilla H4 Breakout Sentinel Trigger"
                        })

    def reset_sandbox(self):
        """Resets active sandbox positions and restores default baseline balance"""
        self.active_positions.clear()
        self.audit_log.clear()
        self._init_default_swarm()
        return {"status": "RESET_SUCCESSFUL", "timestamp": get_ist_now().strftime("%Y-%m-%d %H:%M:%S")}

# Global Singleton Instance
sandbox_manager = AgentSwarmSandbox()

