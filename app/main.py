import os
import asyncio
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.database import (
    get_db,
    init_db,
    get_nse_companies,
    get_company_by_symbol,
    get_sectors_summary,
    get_universes_summary
)
from app.market_simulator import market_sim
from app.signals import (
    generate_options_trades,
    generate_intraday_trades,
    generate_index_trades,
    generate_multiday_trades,
    generate_positional_trades,
    generate_fibonacci_pivots,
    generate_cpr_pivots,
    generate_rsi_trends,
    generate_adx_trends,
    generate_atr_trends,
    generate_candlestick_alerts,
    generate_heikin_ashi_patterns,
    generate_ichimoku_data,
    generate_stock_trends,
    generate_technical_indicators,
    generate_investment_trades,
    generate_turning_times,
    generate_changed_now,
    get_market_trend_regime,
    generate_active_stocks,
    generate_fibonacci_heatmap,
    generate_camarilla_heatmap,
    generate_cpr_heatmap
)

# Initialize database on startup
init_db()

app = FastAPI(title="GKWA Trading Terminal", version="3.0.0")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "static")
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")

os.makedirs(STATIC_DIR, exist_ok=True)
os.makedirs(TEMPLATES_DIR, exist_ok=True)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
templates = Jinja2Templates(directory=TEMPLATES_DIR)

# --- REAL-TIME STREAMING & DATA PIPELINE ENGINE ---

class LiveFeedManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.latest_tick_data: dict = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        try:
            snapshot = market_sim.get_latest_snapshot()
            await websocket.send_json(snapshot)
        except Exception:
            pass

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, data: dict):
        self.latest_tick_data = data
        disconnected = []
        for connection in list(self.active_connections):
            try:
                await connection.send_json(data)
            except Exception:
                disconnected.append(connection)
        for conn in disconnected:
            self.disconnect(conn)

feed_manager = LiveFeedManager()

@app.on_event("startup")
async def start_background_tick_stream():
    asyncio.create_task(run_continuous_ticker())

async def run_continuous_ticker():
    """Perpetual background worker ticking the market every 1.0s with zero errors"""
    while True:
        try:
            delta = market_sim.step_simulation_tick()
            await feed_manager.broadcast(delta)
        except Exception as e:
            print("Background tick worker error:", e)
        await asyncio.sleep(1.0)

# --- MARKETING & ROOT ROUTE ---

@app.get("/", response_class=HTMLResponse)
async def home_page(request: Request):
    """GKWA Public Marketing Landing Page"""
    ticker_data = market_sim.get_indices_ticker()
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"ticker": ticker_data}
    )

@app.get("/dashboard/", response_class=HTMLResponse)
@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard_page(request: Request):
    """GKWA Web Trading Terminal (Default View)"""
    ticker_data = market_sim.get_indices_ticker()
    return templates.TemplateResponse(
        request=request,
        name="dashboard.html",
        context={"ticker": ticker_data, "active_tab": "intraday"}
    )

# --- REPLICATE EVERY EXACT NEOTRADER BROWSER URL: /index/<route>/ ---

ROUTE_TAB_MAP = {
    "dashboard": "sector",
    "sector_analysis_view": "sector",
    "ha_patterns": "heikinashi",
    "Fibonacci_pivot": "fibonacci",
    "Option_Trades": "options",
    "atr": "atr",
    "camarilla": "camarilla",
    "candlestick_alerts": "candlestick",
    "cpr": "cpr",
    "ichimoku": "ichimoku",
    "intraday_trade": "intraday",
    "investments": "investments",
    "multiday_trade": "multiday",
    "positional_trades": "positional",
    "rsi_trends": "rsi",
    "stock_trends": "stock_trends",
    "technical_indicators": "technical_indicators",
    "trending": "adx",
    "indices": "indices",
    "turning_time": "turning",
    "changed_now": "changed",
    "rolling_ticker": "intraday",
    "stock_analyser": "stock-analyser",
    "query_window": "query",
    "watchlist": "watchlist",
    "my_trades": "my-trades",
    "realtime_charts": "charts"
}

@app.get("/index/{route_name}/", response_class=HTMLResponse)
@app.get("/index/{route_name}", response_class=HTMLResponse)
async def index_subroute_page(request: Request, route_name: str):
    """Directly replicates every sub-page URL from the user's browser session"""
    tab = ROUTE_TAB_MAP.get(route_name, "intraday")
    ticker_data = market_sim.get_indices_ticker()
    return templates.TemplateResponse(
        request=request,
        name="dashboard.html",
        context={
            "ticker": ticker_data,
            "active_tab": tab,
            "active_route": route_name
        }
    )

# --- OFFICIAL NEOTRADER DASHBOARD REST APIS ---

@app.get("/dashboard/Live_Broad_Market/")
@app.get("/dashboard/Live_Broad_Market")
@app.get("/api/broad-market")
async def api_live_broad_market():
    """Returns the 7 broad market indices: NIFTY, BANKNIFTY, MIDCAP 100, SMLCAP 100, NIFTY 500, FINNIFTY, SENSEX"""
    return {"data": market_sim.get_broad_market_indices()}

@app.get("/dashboard/Live_Sector_Market/")
@app.get("/dashboard/Live_Sector_Market")
@app.get("/api/sectors")
async def api_live_sector_market():
    """Returns the 17 sector performance indices for Sector View / Performance"""
    return {"data": market_sim.get_sector_market_indices()}

@app.get("/dashboard/Live_HeatMap/")
@app.get("/dashboard/Live_HeatMap")
@app.get("/dashboard/Live_HeatMap_Open_Close/")
@app.get("/dashboard/Live_HeatMap_Open_Close")
async def api_live_heatmap(format: Optional[str] = None, universe: Optional[str] = "NIFTY FNO", mode: Optional[str] = "Close"):
    """Returns all universe stocks with LTP, DAY_CLOSE_CHG_P, DAY_OPEN_CHG_P for Advance/Decline & HeatMap"""
    return {"data": market_sim.get_heatmap_stocks(universe=universe, mode=mode)}

@app.get("/dashboard/Dashboard_Stats_Getdata/")
@app.get("/dashboard/Dashboard_Stats_Getdata")
async def api_dashboard_stats():
    """Returns statistics for Stock Change buckets and Pivots Change buckets"""
    return market_sim.get_dashboard_stats()

@app.get("/dashboard/Dashboard_Gap_Summary_Getdata/")
@app.get("/dashboard/Dashboard_Gap_Summary_Getdata")
async def api_dashboard_gap_summary():
    """Returns Gap Up/Down follow-through statistics"""
    return market_sim.get_gap_summary()

@app.get("/dashboard/Dashboard_Last_Refresh_Datetime/")
@app.get("/dashboard/Dashboard_Last_Refresh_Datetime")
async def api_dashboard_refresh_time():
    now = datetime.now()
    now_iso = now.strftime("%Y-%m-%d %H:%M:%S")
    now_dmy = now.strftime("%d-%b-%Y %H:%M:%S")
    return [{"ATTRIBUTE_KEY": now_iso, "LAST_DATETIME": now_iso, "formatted": now_dmy}]

@app.get("/api/live_feed_delta")
@app.get("/api/live_feed_delta/")
async def api_live_feed_delta():
    """Returns the latest market tick delta packet (REST fallback for real-time pipeline)"""
    if not feed_manager.latest_tick_data or os.environ.get("VERCEL"):
        delta = market_sim.step_simulation_tick()
        feed_manager.latest_tick_data = delta
    return feed_manager.latest_tick_data or market_sim.get_latest_snapshot()

@app.get("/app/day_trader_stocks/")
@app.get("/app/day_trader_stocks")
async def api_day_trader_stocks():
    """Returns real-time day trader bullets signals"""
    return market_sim.get_day_trader_bullets()

@app.get("/app/cpr_active_stocks/")
@app.get("/app/cpr_active_stocks")
async def api_cpr_active_stocks():
    return market_sim.get_day_trader_bullets()

@app.get("/app/active_stocks/")
@app.get("/app/active_stocks")
@app.get("/api/active-stocks")
async def api_active_stocks():
    return generate_active_stocks()

@app.get("/app/trade_range_targets/")
@app.get("/app/trade_range_targets")
async def api_trade_range_targets():
    return market_sim.get_day_trader_bullets()

@app.get("/static/pdf2/Dashboard_1.pdf")
@app.get("/Dashboard - Dashboard_1.pdf")
@app.get("/static/pdf2/Dashboard - Dashboard_1.pdf")
async def serve_dashboard_pdf():
    pdf_path = os.path.join(BASE_DIR, "static", "pdf2", "Dashboard_1.pdf")
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename="Dashboard - Dashboard_1.pdf"
    )

# --- REST APIS FOR ALL MODULES (BOTH NEOTRADER & NEW SCHEMAS) ---

@app.get("/app/Market_Trend_Regime/")
@app.get("/api/market-trend")
async def api_market_trend():
    return get_market_trend_regime()

@app.get("/api/ticker")
async def api_ticker():
    return market_sim.get_indices_ticker()

# 1. Intraday Trades
@app.get("/api/intraday-trades")
@app.get("/api/intraday_trade")
async def api_intraday_trades(strategy: Optional[str] = None, alert: Optional[str] = None, status: Optional[str] = None):
    trades = generate_intraday_trades()
    if strategy and strategy != "ALL":
        trades = [t for t in trades if t["STRATEGY_CODE"] == strategy]
    if alert and alert != "ALL":
        trades = [t for t in trades if t["ALERT"] == alert]
    if status and status != "ALL":
        trades = [t for t in trades if t["STATUS"] == status]
    return trades

# 2. Heikin Ashi Patterns
@app.get("/api/heikin-ashi")
@app.get("/api/ha_patterns")
async def api_heikin_ashi():
    return generate_heikin_ashi_patterns()

# 3. CPR (Central Pivot Range)
@app.get("/api/cpr-pivots")
@app.get("/api/cpr")
@app.get("/api/cpr-trends")
async def api_cpr_pivots():
    return generate_cpr_pivots()

@app.get("/api/cpr-heatmap")
async def api_cpr_heatmap():
    return generate_cpr_heatmap()

# 4. Fibonacci Pivots
@app.get("/api/fibonacci-pivots")
@app.get("/api/Fibonacci_pivot")
async def api_fibonacci_pivots():
    return generate_fibonacci_pivots()

@app.get("/api/fibonacci-heatmap")
async def api_fibonacci_heatmap():
    return generate_fibonacci_heatmap()

# 5. Camarilla Pivots
@app.get("/api/camarilla")
async def api_camarilla():
    return market_sim.get_camarilla_levels()

@app.get("/api/camarilla-heatmap")
async def api_camarilla_heatmap():
    return generate_camarilla_heatmap()

# 6. ADX Trending
@app.get("/api/adx-trends")
@app.get("/api/trending")
async def api_adx_trends():
    return generate_adx_trends()

# 7. ATR Trends
@app.get("/api/atr-trends")
@app.get("/api/atr")
async def api_atr_trends():
    return generate_atr_trends()

# 8. RSI Trends
@app.get("/api/rsi-trends")
@app.get("/api/rsi_trends")
async def api_rsi_trends():
    return generate_rsi_trends()

# 9. Candlestick Alerts
@app.get("/api/candlestick-alerts")
@app.get("/api/candlestick_alerts")
async def api_candlestick_alerts():
    return generate_candlestick_alerts()

# 10. Ichimoku Cloud
@app.get("/api/ichimoku")
async def api_ichimoku():
    return generate_ichimoku_data()

# 11. Intraday Stock Trends (30M timeline)
@app.get("/api/stock-trends")
@app.get("/api/stock_trends")
async def api_stock_trends():
    return generate_stock_trends()

# 12. Technical Indicators
@app.get("/api/technical-indicators")
@app.get("/api/technical_indicators")
async def api_technical_indicators():
    return generate_technical_indicators()

# 13. Investment Trades
@app.get("/api/investments")
@app.get("/api/investment-trades")
@app.get("/api/investment_trades")
async def api_investments():
    return generate_investment_trades()

# 14. Index Trades
@app.get("/api/index-trades")
@app.get("/api/indices")
async def api_index_trades():
    return generate_index_trades()

# 15. Multiday Trades
@app.get("/api/multiday-trades")
@app.get("/api/multiday_trade")
async def api_multiday_trades():
    return generate_multiday_trades()

# 16. Positional Trades
@app.get("/api/positional-trades")
@app.get("/api/positional_trades")
async def api_positional_trades():
    return generate_positional_trades()

# 17. Sector View
@app.get("/api/sector-view")
@app.get("/api/sector_analysis_view")
async def api_sector_view():
    return market_sim.get_sector_performance()

# 18. Options Alerts
@app.get("/api/options-alerts")
@app.get("/api/option-trades")
@app.get("/api/option_trades")
@app.get("/api/Option_Trades")
async def api_options_alerts():
    return generate_options_trades()

# 19. Turning Times
@app.get("/api/turning-times")
@app.get("/api/turning_time")
async def api_turning_times():
    return generate_turning_times()

# 20. Changed Now
@app.get("/api/changed-now")
@app.get("/api/changed_now")
async def api_changed_now():
    return generate_changed_now()

# --- LEAD CAPTURE & DEMO BOOKING ---

class LeadModel(BaseModel):
    name: str
    phone: str
    country_code: str = "+91"
    email: str

@app.post("/api/book-demo")
async def api_book_demo(lead: LeadModel):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO leads (name, phone, country_code, email)
        VALUES (?, ?, ?, ?)
    """, (lead.name, lead.phone, lead.country_code, lead.email))
    conn.commit()
    lead_id = cursor.lastrowid
    conn.close()
    return {
        "status": "success",
        "message": f"Demo access unlocked for {lead.name}! Our senior trading specialist will contact you on {lead.phone}.",
        "lead_id": lead_id
    }

# --- 1-CLICK PAPER TRADING & ORDERS ---

class TradeOrder(BaseModel):
    symbol: str
    strategy: str
    alert: str
    entry_price: float
    current_price: float
    target1: Optional[float] = None
    target2: Optional[float] = None
    stoploss: Optional[float] = None
    qty: int = 50
    broker: str = "PAPER_TRADE"

@app.post("/api/paper-trade")
async def api_place_trade(trade: TradeOrder):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO paper_trades (symbol, strategy, alert, entry_price, current_price, target1, target2, stoploss, qty, status, pnl, broker)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 0.0, ?)
    """, (trade.symbol, trade.strategy, trade.alert, trade.entry_price, trade.current_price, trade.target1, trade.target2, trade.stoploss, trade.qty, trade.broker))
    conn.commit()
    order_id = cursor.lastrowid
    conn.close()
    return {
        "status": "success",
        "message": f"Order #{order_id} executed successfully via {trade.broker}! {trade.alert} {trade.qty} shares of {trade.symbol} @ ₹{trade.entry_price}",
        "order_id": order_id
    }

@app.get("/api/paper-trades")
async def api_get_trades():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM paper_trades ORDER BY id DESC")
    rows = [dict(r) for r in cursor.fetchall()]
    
    for r in rows:
        st = market_sim.stocks.get(r["symbol"])
        if st:
            cur_price = st["ltp"]
            r["current_price"] = cur_price
            diff = (cur_price - r["entry_price"]) if r["alert"] == "BUY" else (r["entry_price"] - cur_price)
            r["pnl"] = round(diff * r["qty"], 2)
    conn.close()
    return rows

@app.delete("/api/paper-trades/{order_id}")
async def api_close_trade(order_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE paper_trades SET status = 'CLOSED' WHERE id = ?", (order_id,))
    conn.commit()
    conn.close()
    return {"status": "success", "message": f"Trade #{order_id} closed."}

# --- WATCHLIST MANAGEMENT ---

@app.get("/api/watchlist")
async def api_get_watchlist():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM watchlist ORDER BY id ASC")
    rows = [dict(r) for r in cursor.fetchall()]
    results = []
    for r in rows:
        st = market_sim.stocks.get(r["symbol"], {"ltp": 0.0, "chg": 0.0, "chg_pct": 0.0})
        results.append({
            "id": r["id"],
            "symbol": r["symbol"],
            "ltp": st["ltp"],
            "chg": st.get("chg", 0.0),
            "chg_pct": st.get("chg_pct", 0.0),
            "is_up": st.get("chg", 0.0) >= 0
        })
    conn.close()
    return results

@app.post("/api/watchlist/{symbol}")
async def api_add_watchlist(symbol: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("INSERT OR IGNORE INTO watchlist (symbol) VALUES (?)", (symbol.upper(),))
    conn.commit()
    conn.close()
    return {"status": "success", "message": f"{symbol.upper()} added to Watchlist."}

@app.delete("/api/watchlist/{symbol}")
async def api_remove_watchlist(symbol: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM watchlist WHERE symbol = ?", (symbol.upper(),))
    conn.commit()
    conn.close()
    return {"status": "success", "message": f"{symbol.upper()} removed from Watchlist."}

# --- ALL NSE 2,500+ COMPANIES & UNIVERSE APIS ---

@app.get("/api/companies")
@app.get("/api/nse-companies")
async def api_get_companies(
    q: Optional[str] = None,
    sector: Optional[str] = None,
    universe: Optional[str] = None,
    page: int = 1,
    page_size: int = 50
):
    """
    Search and paginate across all 2,559+ active NSE listed companies.
    Filter by keyword (q), sector, or index universe (FNO, NIFTY 50, NIFTY 100, NIFTY 500, MIDCAP, SMALLCAP).
    """
    result = get_nse_companies(
        query=q,
        sector=sector,
        universe=universe,
        page=page,
        page_size=page_size
    )
    # Sync with live simulator prices
    for item in result["items"]:
        st = market_sim.stocks.get(item["symbol"])
        if st:
            item["price"] = st["ltp"]
            item["high"] = st["high"]
            item["low"] = st["low"]
            item["chg_pct"] = st["chg_pct"]
    return result

@app.get("/api/companies/{symbol}")
async def api_get_company(symbol: str):
    """Returns company profile and real-time trading metrics for a single stock"""
    sym = symbol.strip().upper()
    comp = get_company_by_symbol(sym)
    if not comp:
        st = market_sim.stocks.get(sym)
        if not st:
            return JSONResponse(status_code=404, content={"error": f"Company '{sym}' not found"})
        return {
            "symbol": sym,
            "name": sym,
            "series": "EQ",
            "isin": "",
            "face_value": 10.0,
            "sector": st.get("sector", "INDUSTRIAL"),
            "price": st["ltp"],
            "high": st["high"],
            "low": st["low"],
            "open_price": st["open"],
            "prev_close": st["prev_close"],
            "chg_pct": st["chg_pct"],
            "is_fno": 1 if st.get("is_fno") else 0
        }
    
    st = market_sim.stocks.get(sym)
    if st:
        comp["price"] = st["ltp"]
        comp["high"] = st["high"]
        comp["low"] = st["low"]
        comp["chg_pct"] = st["chg_pct"]
    return comp

@app.get("/api/sectors")
async def api_get_sectors():
    """Returns aggregate performance and advance/decline stats across all NSE sectors"""
    return get_sectors_summary()

@app.get("/api/universes")
async def api_get_universes():
    """Returns constituent stock counts across all GKWA trading universes"""
    return get_universes_summary()

# --- WEBSOCKET FOR REALTIME TICKER & LIVE FEED STREAMING ---

@app.websocket("/ws/live_feed")
async def websocket_live_feed(websocket: WebSocket):
    """Real-time market streaming feed with delta packets every 1.0s"""
    await feed_manager.connect(websocket)
    try:
        while True:
            # Keep socket open and accept client messages/pings
            await websocket.receive_text()
    except (WebSocketDisconnect, Exception):
        feed_manager.disconnect(websocket)

@app.websocket("/ws/ticker")
async def websocket_ticker(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            ticker_data = market_sim.get_indices_ticker()
            await websocket.send_json({
                "type": "ticker_update",
                "data": ticker_data,
                "regime": get_market_trend_regime()[0]
            })
            await asyncio.sleep(1.0)
    except (WebSocketDisconnect, Exception):
        pass
