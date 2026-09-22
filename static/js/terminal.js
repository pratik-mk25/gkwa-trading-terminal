// NeoTrader Comprehensive Trading Terminal Engine

const TAB_ROUTE_MAP = {
    "intraday": "intraday_trade",
    "indices": "indices",
    "multiday": "multiday_trade",
    "positional": "positional_trades",
    "investments": "investments",
    "options": "Option_Trades",
    "camarilla": "camarilla",
    "cpr": "cpr",
    "fibonacci": "Fibonacci_pivot",
    "atr": "atr",
    "rsi": "rsi_trends",
    "adx": "trending",
    "candlestick": "candlestick_alerts",
    "heikinashi": "ha_patterns",
    "ichimoku": "ichimoku",
    "stock_trends": "stock_trends",
    "technical_indicators": "technical_indicators",
    "turning": "turning_time",
    "changed": "changed_now",
    "sector": "sector_analysis_view",
    "charts": "realtime_charts",
    "stock-analyser": "stock_analyser",
    "query": "query_window",
    "watchlist": "watchlist",
    "my-trades": "my_trades"
};

let currentTab = "intraday";
let autoRefreshTimer = null;
let currentTrades = [];
let activeTradeToOrder = null;

document.addEventListener("DOMContentLoaded", () => {
    initTerminalWebSocket();
    setupNavigation();
    
    // Determine initial active tab from body dataset or path
    const initialTab = document.body.dataset.initialTab || "intraday";
    switchTab(initialTab, false);

    // Initial preload of foundational data
    loadIntradayTrades();
    loadIndexTrades();
    loadMultidayTrades();
    loadPositionalTrades();
    loadInvestmentTrades();
    loadSectorView();
    loadCamarillaPivots();
    loadCprPivots();
    loadFibonacciPivots();
    loadAtrTrends();
    loadOptionsRadar();
    loadRsiTrends();
    loadAdxTrends();
    loadCandlestickAlerts();
    loadHeikinAshi();
    loadIchimoku();
    loadStockTrends();
    loadTechnicalIndicators();
    loadTurningTimes();
    loadChangedNow();
    loadWatchlist();
    loadPaperTrades();

    setupFilters();
    setupOrderModal();
    initCandlestickChart();

    window.addEventListener("popstate", (e) => {
        if (e.state && e.state.tab) {
            switchTab(e.state.tab, false);
        }
    });
});

// Real-time WebSocket streaming
function initTerminalWebSocket() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/ticker`;
    
    function connect() {
        const ws = new WebSocket(wsUrl);
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "ticker_update") {
                    updateTerminalTicker(data.data);
                    if (data.regime) {
                        updateMarketRegimeBadge(data.regime);
                    }
                }
            } catch (err) {
                console.error("WS error:", err);
            }
        };
        ws.onclose = () => setTimeout(connect, 3000);
    }
    connect();
}

function updateTerminalTicker(items) {
    const track = document.getElementById("terminalTickerTrack");
    if (!track) return;
    
    let html = "";
    const doubled = [...items, ...items];
    doubled.forEach(item => {
        const sign = item.chg >= 0 ? "+" : "";
        const colorClass = item.is_up ? "val-up" : "val-down";
        const icon = item.is_up ? "▲" : "▼";
        html += `
            <div class="ticker-item">
                <span class="sym">${item.symbol}</span>
                <span class="val ${colorClass}">₹${item.ltp.toFixed(2)}</span>
                <span class="${colorClass}">${icon} ${sign}${item.chg_pct}%</span>
            </div>
        `;
    });
    track.innerHTML = html;
}

function updateMarketRegimeBadge(regime) {
    const badge = document.getElementById("marketRegimeBadge");
    if (!badge) return;
    const isBull = regime.MARKET_TREND === "BULLISH";
    badge.className = `px-3 py-1 rounded-full text-xs font-bold ${isBull ? 'bg-emerald-900/60 text-emerald-400 border border-emerald-500/40' : 'bg-rose-900/60 text-rose-400 border border-rose-500/40'}`;
    badge.innerHTML = `REGIME: ${regime.MARKET_TREND} (NIFTY ${regime.NIFTY_PCT >= 0 ? '+' : ''}${regime.NIFTY_PCT}%)`;
}

// Sidebar Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll(".sidebar-nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const target = item.getAttribute("data-tab");
            if (!target) return;
            switchTab(target, true);
        });
    });
}

window.switchTab = function(tabId, updateUrl = true) {
    currentTab = tabId;
    
    if (updateUrl && window.history.pushState) {
        const route = TAB_ROUTE_MAP[tabId] || tabId;
        window.history.pushState({ tab: tabId }, '', `/index/${route}/`);
    }

    document.querySelectorAll(".sidebar-nav-item").forEach(item => {
        if (item.getAttribute("data-tab") === tabId) {
            item.className = "sidebar-nav-item flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-cyan-400 bg-blue-600/20 border-l-4 border-cyan-400 transition-colors";
        } else {
            item.className = "sidebar-nav-item flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors";
        }
    });

    document.querySelectorAll(".tab-view-content").forEach(view => {
        view.classList.add("hidden");
    });

    const activeView = document.getElementById(`tab-${tabId}`);
    if (activeView) {
        activeView.classList.remove("hidden");
    }

    // Trigger tab-specific loader
    if (tabId === "atr") loadAtrTrends();
    else if (tabId === "stock_trends") loadStockTrends();
    else if (tabId === "technical_indicators") loadTechnicalIndicators();
    else if (tabId === "investments") loadInvestmentTrades();
    else if (tabId === "cpr") loadCprPivots();
    else if (tabId === "fibonacci") loadFibonacciPivots();
    else if (tabId === "camarilla") loadCamarillaPivots();
    else if (tabId === "rsi") loadRsiTrends();
    else if (tabId === "adx") loadAdxTrends();
    else if (tabId === "candlestick") loadCandlestickAlerts();
    else if (tabId === "heikinashi") loadHeikinAshi();
    else if (tabId === "ichimoku") loadIchimoku();
    else if (tabId === "turning") loadTurningTimes();
    else if (tabId === "changed") loadChangedNow();
    else if (tabId === "sector") loadSectorView();
    else if (tabId === "options") loadOptionsRadar();
    else if (tabId === "intraday") loadIntradayTrades();
    else if (tabId === "indices") loadIndexTrades();
    else if (tabId === "multiday") loadMultidayTrades();
    else if (tabId === "positional") loadPositionalTrades();
    else if (tabId === "charts") setTimeout(renderChart, 100);
};

// 1. Intraday Trades
async function loadIntradayTrades() {
    const tableBody = document.getElementById("intradayTableBody");
    if (!tableBody) return;

    try {
        const strategy = document.getElementById("filterStrategy") ? document.getElementById("filterStrategy").value : "ALL";
        const status = document.getElementById("filterStatus") ? document.getElementById("filterStatus").value : "ALL";
        const alertFilter = document.getElementById("filterAlert") ? document.getElementById("filterAlert").value : "ALL";

        const res = await fetch(`/api/intraday-trades?strategy=${strategy}&status=${status}&alert=${alertFilter}`);
        const data = await res.json();
        currentTrades = data;
        renderTradesTable(data);

        const timeEl = document.getElementById("lastRefreshTime");
        if (timeEl) timeEl.innerText = new Date().toLocaleTimeString();
    } catch (err) {
        console.error("Error loading intraday trades:", err);
    }
}

function renderTradesTable(trades) {
    const tableBody = document.getElementById("intradayTableBody");
    if (!tableBody) return;

    const searchTerm = (document.getElementById("searchTrades") ? document.getElementById("searchTrades").value : "").toUpperCase();
    const filtered = trades.filter(t => t.SYMBOL.includes(searchTerm) || t.STRATEGY_CODE.includes(searchTerm));

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="15" class="text-center py-8 text-slate-400">No active signals matching selected filters.</td></tr>`;
        return;
    }

    let html = "";
    filtered.forEach(t => {
        const isBuy = t.ALERT === "BUY";
        const alertBadge = isBuy ? "badge-buy" : "badge-sell";
        const statusBadge = t.STATUS.includes("HIT") ? "badge-hit" : "badge-active";
        
        html += `
            <tr>
                <td class="font-mono text-slate-400">${t.RecordID}</td>
                <td class="font-semibold text-white">${t.STRATEGY_CODE}</td>
                <td><span class="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">${t.TIMEPLAY}</span></td>
                <td class="font-bold text-cyan-400 cursor-pointer hover:underline" onclick="selectStockForChart('${t.SYMBOL}')">${t.SYMBOL}</td>
                <td class="font-semibold text-white">₹${t.LTP.toFixed(2)}</td>
                <td><span class="badge-status ${alertBadge}">${t.ALERT}</span></td>
                <td class="text-emerald-400 font-mono">₹${t.ENTRY.toFixed(2)}</td>
                <td class="text-xs text-slate-400 font-mono">${t.SIGNAL_DT}</td>
                <td class="text-rose-400 font-mono">₹${t.STOPLOSS.toFixed(2)}</td>
                <td><span class="badge-status ${statusBadge}">${t.STATUS}</span></td>
                <td class="text-cyan-300 font-mono">₹${t.TARGET_2.toFixed(2)}</td>
                <td class="text-cyan-300 font-mono">₹${t.TARGET_3.toFixed(2)}</td>
                <td class="text-cyan-300 font-mono">₹${t.TARGET.toFixed(2)}</td>
                <td class="text-xs font-mono text-slate-400">${t.SIGNAL_STRENGTH}</td>
                <td>
                    <button class="btn-neotrader text-xs py-1 px-3" onclick="openOrderModal(${t.RecordID})">
                        TRADE
                    </button>
                </td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;
}

// 2. Index Trades
async function loadIndexTrades() {
    const tableBody = document.getElementById("indexTradesTableBody");
    if (!tableBody) return;
    try {
        const res = await fetch("/api/index-trades");
        const data = await res.json();
        let html = "";
        data.forEach(t => {
            html += `
                <tr>
                    <td class="font-mono text-slate-400">${t.id}</td>
                    <td class="font-bold text-cyan-400">${t.symbol}</td>
                    <td class="font-semibold text-white">${t.strategy}</td>
                    <td><span class="badge-status ${t.alert === 'BUY' ? 'badge-buy' : 'badge-sell'}">${t.alert}</span></td>
                    <td class="font-mono text-emerald-400">₹${t.entry}</td>
                    <td class="font-mono font-bold text-white">₹${t.ltp.toFixed(2)}</td>
                    <td class="font-mono text-rose-400">₹${t.stoploss}</td>
                    <td class="font-mono text-cyan-300">₹${t.target1}</td>
                    <td class="font-mono text-cyan-300">₹${t.target2}</td>
                    <td class="font-mono text-yellow-400 text-xs font-bold">${t.suggested_option}</td>
                    <td><span class="badge-status badge-active">${t.status}</span></td>
                    <td>
                        <button class="btn-neotrader text-xs py-1 px-2.5" onclick="quickTrade('${t.symbol}', '${t.alert}', ${t.entry}, ${t.ltp})">
                            EXECUTE
                        </button>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    } catch (err) {
        console.error("Index trades error:", err);
    }
}

// 3. Multiday Play
async function loadMultidayTrades() {
    const tableBody = document.getElementById("multidayTableBody");
    if (!tableBody) return;
    try {
        const res = await fetch("/api/multiday-trades");
        const data = await res.json();
        let html = "";
        data.forEach(t => {
            html += `
                <tr>
                    <td class="font-mono text-slate-400">${t.id}</td>
                    <td class="font-bold text-cyan-400 cursor-pointer hover:underline" onclick="selectStockForChart('${t.symbol}')">${t.symbol}</td>
                    <td class="font-semibold text-white">${t.strategy}</td>
                    <td><span class="badge-status ${t.alert === 'BUY' ? 'badge-buy' : 'badge-sell'}">${t.alert}</span></td>
                    <td class="font-mono text-emerald-400">₹${t.entry}</td>
                    <td class="font-mono font-bold text-white">₹${t.ltp.toFixed(2)}</td>
                    <td class="font-mono text-rose-400">₹${t.stoploss}</td>
                    <td class="font-mono text-cyan-300">₹${t.target1}</td>
                    <td class="font-mono text-cyan-300">₹${t.target2}</td>
                    <td class="text-xs text-slate-400 font-mono">${t.holding}</td>
                    <td><span class="badge-status badge-active">${t.status}</span></td>
                    <td>
                        <button class="btn-neotrader text-xs py-1 px-2.5" onclick="quickTrade('${t.symbol}', '${t.alert}', ${t.entry}, ${t.ltp})">
                            TRADE
                        </button>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    } catch (err) {
        console.error("Multiday trades error:", err);
    }
}

// 4. Positional Play
async function loadPositionalTrades() {
    const tableBody = document.getElementById("positionalTableBody");
    if (!tableBody) return;
    try {
        const res = await fetch("/api/positional-trades");
        const data = await res.json();
        let html = "";
        data.forEach(t => {
            html += `
                <tr>
                    <td class="font-mono text-slate-400">${t.id}</td>
                    <td class="font-bold text-cyan-400 cursor-pointer hover:underline" onclick="selectStockForChart('${t.symbol}')">${t.symbol}</td>
                    <td class="font-semibold text-white">${t.strategy}</td>
                    <td><span class="badge-status ${t.alert === 'BUY' ? 'badge-buy' : 'badge-sell'}">${t.alert}</span></td>
                    <td class="font-mono text-emerald-400">₹${t.entry}</td>
                    <td class="font-mono font-bold text-white">₹${t.ltp.toFixed(2)}</td>
                    <td class="font-mono text-rose-400">₹${t.stoploss}</td>
                    <td class="font-mono text-cyan-300">₹${t.target1}</td>
                    <td class="font-mono text-cyan-300">₹${t.target2}</td>
                    <td class="text-xs text-slate-400 font-mono">${t.timeframe}</td>
                    <td><span class="badge-status badge-hit">${t.status}</span></td>
                    <td>
                        <button class="btn-neotrader text-xs py-1 px-2.5" onclick="quickTrade('${t.symbol}', '${t.alert}', ${t.entry}, ${t.ltp})">
                            TRADE
                        </button>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    } catch (err) {
        console.error("Positional trades error:", err);
    }
}

// 5. Camarilla Pivots Matrix
async function loadCamarillaPivots() {
    const tableBody = document.getElementById("camarillaTableBody");
    if (!tableBody) return;
    try {
        const res = await fetch("/api/camarilla");
        const data = await res.json();
        let html = "";
        data.forEach((row, idx) => {
            const sym = row.symbol || row.SYMBOL;
            const ltp = Number(row.ltp || row.LTP || 0);
            const signal = row.signal || "NEUTRAL";
            const isBreakout = signal.includes("BREAKOUT");
            const isBreakdown = signal.includes("BREAKDOWN");
            const badgeClass = isBreakout ? "badge-buy" : (isBreakdown ? "badge-sell" : "badge-active");

            html += `
                <tr>
                    <td class="font-mono text-slate-400">${idx + 1}</td>
                    <td class="font-bold text-white cursor-pointer hover:underline" onclick="selectStockForChart('${sym}')">${sym}</td>
                    <td class="font-bold text-cyan-400">₹${ltp.toFixed(2)}</td>
                    <td><span class="badge-status ${badgeClass}">${signal}</span></td>
                    <td class="text-xs text-rose-300 font-mono">₹${row.h6}</td>
                    <td class="text-xs text-rose-400 font-mono">₹${row.h5}</td>
                    <td class="text-xs font-bold text-emerald-400 font-mono bg-emerald-950/40 px-2">₹${row.h4}</td>
                    <td class="text-xs text-emerald-300 font-mono">₹${row.h3}</td>
                    <td class="text-xs text-emerald-200 font-mono">₹${row.h2}</td>
                    <td class="text-xs text-emerald-100 font-mono">₹${row.h1}</td>
                    <td class="text-xs text-rose-100 font-mono">₹${row.l1}</td>
                    <td class="text-xs text-rose-200 font-mono">₹${row.l2}</td>
                    <td class="text-xs text-rose-300 font-mono">₹${row.l3}</td>
                    <td class="text-xs font-bold text-rose-400 font-mono bg-rose-950/40 px-2">₹${row.l4}</td>
                    <td class="text-xs text-rose-500 font-mono">₹${row.l5}</td>
                    <td class="text-xs text-rose-600 font-mono">₹${row.l6}</td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    } catch (err) {
        console.error("Camarilla error:", err);
    }
}

// 6. CPR (Central Pivot Range)
async function loadCprPivots() {
    const tableBody = document.getElementById("cprTableBody");
    if (!tableBody) return;
    try {
        const res = await fetch("/api/cpr");
        const data = await res.json();
        let html = "";
        data.forEach(row => {
            const sym = row.symbol || row.SYMBOL;
            const ltp = Number(row.ltp || row.LTP || 0);
            const tc = Number(row.tc || row.TC || 0);
            const pivot = Number(row.pivot || row.P || row.PIVOT || 0);
            const bc = Number(row.bc || row.BC || 0);
            const width = row.width || (row.CPR_WIDTH ? row.CPR_WIDTH + '%' : '0.35%');
            const cprType = row.cpr_type || ((row.CPR_WIDTH || 0.4) < 0.35 ? 'NARROW CPR (TRENDING)' : 'WIDE CPR (RANGEBOUND)');
            const trend = row.trend || (ltp > tc ? 'BULLISH (ABOVE TC)' : (ltp < bc ? 'BEARISH (BELOW BC)' : 'INSIDE CPR'));
            const isNarrow = cprType.includes("NARROW");

            html += `
                <tr>
                    <td class="font-bold text-cyan-400 cursor-pointer hover:underline" onclick="selectStockForChart('${sym}')">${sym}</td>
                    <td class="font-mono font-bold text-white">₹${ltp.toFixed(2)}</td>
                    <td class="font-mono text-slate-300">₹${tc.toFixed(2)}</td>
                    <td class="font-mono text-yellow-400 font-bold">₹${pivot.toFixed(2)}</td>
                    <td class="font-mono text-slate-300">₹${bc.toFixed(2)}</td>
                    <td class="font-mono text-cyan-300">${width}</td>
                    <td><span class="badge-status ${isNarrow ? 'badge-buy' : 'badge-active'}">${cprType}</span></td>
                    <td class="text-xs text-slate-300 font-medium">${trend}</td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    } catch (err) {
        console.error("CPR error:", err);
    }
}

// 7. Fibonacci Pivots
async function loadFibonacciPivots() {
    const tableBody = document.getElementById("fibonacciTableBody");
    if (!tableBody) return;
    try {
        const res = await fetch("/api/Fibonacci_pivot");
        const data = await res.json();
        let html = "";
        data.forEach(row => {
            const sym = row.symbol || row.SYMBOL;
            const ltp = Number(row.ltp || row.LTP || 0);
            const pivot = Number(row.pivot || row.PIVOT || row.P || 0);
            const r1 = Number(row.r1 || row.R1 || 0);
            const r2 = Number(row.r2 || row.R2 || 0);
            const r3 = Number(row.r3 || row.R3 || 0);
            const s1 = Number(row.s1 || row.S1 || 0);
            const s2 = Number(row.s2 || row.S2 || 0);
            const s3 = Number(row.s3 || row.S3 || 0);
            const pos = row.position || (ltp >= pivot ? 'ABOVE PIVOT (BULLISH)' : 'BELOW PIVOT (BEARISH)');

            html += `
                <tr>
                    <td class="font-bold text-cyan-400 cursor-pointer hover:underline" onclick="selectStockForChart('${sym}')">${sym}</td>
                    <td class="font-mono font-bold text-white">₹${ltp.toFixed(2)}</td>
                    <td class="font-mono text-yellow-400 font-bold">₹${pivot.toFixed(2)}</td>
                    <td class="font-mono text-emerald-300 text-xs">₹${r1.toFixed(2)}</td>
                    <td class="font-mono text-emerald-400 text-xs">₹${r2.toFixed(2)}</td>
                    <td class="font-mono text-emerald-500 text-xs font-bold">₹${r3.toFixed(2)}</td>
                    <td class="font-mono text-rose-300 text-xs">₹${s1.toFixed(2)}</td>
                    <td class="font-mono text-rose-400 text-xs">₹${s2.toFixed(2)}</td>
                    <td class="font-mono text-rose-500 text-xs font-bold">₹${s3.toFixed(2)}</td>
                    <td><span class="badge-status ${pos.includes('BULLISH') ? 'badge-buy' : 'badge-sell'}">${pos}</span></td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    } catch (err) {
        console.error("Fibonacci error:", err);
    }
}

// ATR Volatility Trends
async function loadAtrTrends() {
    const tableBody = document.getElementById("atrTableBody");
    if (!tableBody) return;
    try {
        const res = await fetch("/api/atr");
        const data = await res.json();
        let html = "";
        data.forEach(row => {
            const sym = row.SYMBOL || row.symbol;
            const ltp = row.LTP || row.ltp;
            const high = row.HIGH || row.high;
            const low = row.LOW || row.low;
            const atr = row.ATR || row.atr;
            const status = row.ATR_ST || row.status || "NORMAL";
            const tf = row.TIMEFRAME || row.timeframe || "Daily";
            const isExpansion = status.includes("EXPANSION");
            html += `
                <tr>
                    <td class="font-bold text-cyan-400 cursor-pointer hover:underline" onclick="selectStockForChart('${sym}')">${sym}</td>
                    <td class="font-mono font-bold text-white">₹${Number(ltp).toFixed(2)}</td>
                    <td class="font-mono text-emerald-400 text-xs">₹${Number(high).toFixed(2)}</td>
                    <td class="font-mono text-rose-400 text-xs">₹${Number(low).toFixed(2)}</td>
                    <td class="font-mono font-bold text-yellow-400 text-sm">₹${Number(atr).toFixed(2)}</td>
                    <td><span class="badge-status ${isExpansion ? 'badge-buy' : 'badge-active'}">${status}</span></td>
                    <td class="text-xs text-slate-400 font-mono">${tf}</td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    } catch (err) {
        console.error("ATR error:", err);
    }
}

// 8. RSI Trends
async function loadRsiTrends() {
    const tableBody = document.getElementById("rsiTableBody");
    if (!tableBody) return;
    try {
        const res = await fetch("/api/rsi_trends");
        const data = await res.json();
        let html = "";
        data.forEach(row => {
            const sym = row.symbol || row.SYMBOL;
            const ltp = Number(row.ltp || row.LTP || 0);
            const rsi = Number(row.rsi || row.T_RSI || row.D_RSI || 50);
            const cond = row.condition || row.BREAKOUT || (rsi > 60 ? 'BULLISH BREAKOUT' : (rsi < 40 ? 'BEARISH BREAKDOWN' : 'CONSOLIDATION'));
            const act = row.action || (rsi > 60 ? 'MOMENTUM BUY' : (rsi < 40 ? 'EXIT / SHORT' : 'HOLD RANGE'));
            const isBull = rsi > 50;
            html += `
                <tr>
                    <td class="font-bold text-cyan-400 cursor-pointer hover:underline" onclick="selectStockForChart('${sym}')">${sym}</td>
                    <td class="font-mono text-white">₹${ltp.toFixed(2)}</td>
                    <td class="font-mono font-bold text-base ${isBull ? 'text-emerald-400' : 'text-rose-400'}">${rsi.toFixed(1)}</td>
                    <td><span class="badge-status ${isBull ? 'badge-buy' : 'badge-sell'}">${cond}</span></td>
                    <td class="text-xs text-slate-300 font-semibold">${act}</td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    } catch (err) {
        console.error("RSI error:", err);
    }
}

// 9. ADX Trend Strength
async function loadAdxTrends() {
    const tableBody = document.getElementById("adxTableBody");
    if (!tableBody) return;
    try {
        const res = await fetch("/api/trending");
        const data = await res.json();
        let html = "";
        data.forEach(row => {
            const sym = row.symbol || row.SYMBOL;
            const ltp = Number(row.ltp || row.LTP || 0);
            const adx = Number(row.adx || row.ADX || 25);
            const pdi = Number(row.plus_di || row.PDI || 20);
            const mdi = Number(row.minus_di || row.MDI || 20);
            const strength = row.strength || row.ADX_SCORE || (adx > 25 ? 'STRONG TREND' : 'MILD TREND');
            const direction = row.direction || row.DIRSTR || (pdi > mdi ? 'BULL (+DI > -DI)' : 'BEAR (-DI > +DI)');
            const isStrong = adx > 25;
            html += `
                <tr>
                    <td class="font-bold text-cyan-400 cursor-pointer hover:underline" onclick="selectStockForChart('${sym}')">${sym}</td>
                    <td class="font-mono text-white">₹${ltp.toFixed(2)}</td>
                    <td class="font-mono font-bold text-base ${isStrong ? 'text-yellow-400' : 'text-slate-400'}">${adx.toFixed(1)}</td>
                    <td class="font-mono text-emerald-400 text-xs">${pdi.toFixed(1)}</td>
                    <td class="font-mono text-rose-400 text-xs">${mdi.toFixed(1)}</td>
                    <td><span class="badge-status ${isStrong ? 'badge-buy' : 'badge-active'}">${strength}</span></td>
                    <td class="text-xs font-semibold ${direction.includes('BULL') ? 'text-emerald-400' : 'text-rose-400'}">${direction}</td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    } catch (err) {
        console.error("ADX error:", err);
    }
}

// 10. Candlestick Alerts
async function loadCandlestickAlerts() {
    const tableBody = document.getElementById("candlestickTableBody");
    if (!tableBody) return;
    try {
        const res = await fetch("/api/candlestick_alerts");
        const data = await res.json();
        let html = "";
        data.forEach((row, idx) => {
            const sym = row.symbol || row.SYMBOL;
            const ltp = Number(row.ltp || row.LTP || 0);
            const pattern = row.pattern || row.ENGULFING || (row.HAMMER === 'YES' ? 'HAMMER' : (row.DOJI === 'YES' ? 'DOJI' : (row.SHOOTINGSTAR === 'YES' ? 'SHOOTING STAR' : 'BULLISH BAR')));
            const tf = row.timeframe || row.TIMEFRAME || "30Min";
            const signal = row.signal || ((row.SCORE || 8) >= 8.5 ? "STRONG BULLISH" : "NEUTRAL BIAS");
            const status = row.status || "CONFIRMED";
            html += `
                <tr>
                    <td class="font-mono text-slate-400">${idx + 1}</td>
                    <td class="font-bold text-cyan-400 cursor-pointer hover:underline" onclick="selectStockForChart('${sym}')">${sym}</td>
                    <td class="font-bold text-yellow-400">${pattern}</td>
                    <td class="text-xs text-slate-400 font-mono">${tf}</td>
                    <td class="font-mono text-white">₹${ltp.toFixed(2)}</td>
                    <td class="text-xs text-emerald-400 font-semibold">${signal}</td>
                    <td><span class="badge-status badge-active">${status}</span></td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    } catch (err) {
        console.error("Candlestick error:", err);
    }
}

// 11. Heikin Ashi Patterns
async function loadHeikinAshi() {
    const tableBody = document.getElementById("heikinAshiTableBody");
    if (!tableBody) return;
    try {
        const res = await fetch("/api/ha_patterns");
        const data = await res.json();
        let html = "";
        data.forEach((row, idx) => {
            const sym = row.symbol || row.SYMBOL;
            const ltp = Number(row.ltp || row.LTP || 0);
            const pattern = row.pattern || row.LONG_BODY || row.SMALL_BODY || "FLAT BOTTOM GREEN";
            const trend = row.trend || row.CONFIRMED_TREND || "CONFIRMED UP";
            const act = row.action || (row.CONTINUE_TREND === "YES" ? "CONTINUE LONG" : (row.REVERSE_TREND === "YES" ? "REVERSAL ALERT" : "HOLD POSITION"));
            const isBull = trend.includes("UP") || trend.includes("CONFIRMED");
            html += `
                <tr>
                    <td class="font-mono text-slate-400">${idx + 1}</td>
                    <td class="font-bold text-cyan-400 cursor-pointer hover:underline" onclick="selectStockForChart('${sym}')">${sym}</td>
                    <td class="font-semibold text-white">${pattern}</td>
                    <td class="font-mono text-white">₹${ltp.toFixed(2)}</td>
                    <td><span class="badge-status ${isBull ? 'badge-buy' : 'badge-sell'}">${trend}</span></td>
                    <td class="text-xs text-cyan-300 font-semibold">${act}</td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    } catch (err) {
        console.error("Heikin Ashi error:", err);
    }
}

// 12. Ichimoku Cloud Breakouts
async function loadIchimoku() {
    const tableBody = document.getElementById("ichimokuTableBody");
    if (!tableBody) return;
    try {
        const res = await fetch("/api/ichimoku");
        const data = await res.json();
        let html = "";
        data.forEach((row, idx) => {
            const sym = row.symbol || row.SYMBOL;
            const ltp = Number(row.ltp || row.LTP || 0);
            const cloudStatus = row.cloud_status || (ltp >= (row.Senkou_Span_A || 0) ? "ABOVE CLOUD (BULLISH)" : "BELOW CLOUD (BEARISH)");
            const tkCross = row.tk_cross || ((row.Tenkan_Sen || 0) >= (row.Kijun_Sen || 0) ? "TENKAN > KIJUN" : "TENKAN < KIJUN");
            const spanStatus = row.span_status || ((row.Senkou_Span_A || 0) >= (row.Senkou_Span_B || 0) ? "SPAN A > SPAN B" : "SPAN A < SPAN B");
            const sig = row.signal || ((row.BULL_SCORE || 5) >= (row.BEAR_SCORE || 5) ? "STRONG BUY" : "HOLD / SELL");
            const isBuy = sig.includes("BUY");
            html += `
                <tr>
                    <td class="font-mono text-slate-400">${idx + 1}</td>
                    <td class="font-bold text-cyan-400 cursor-pointer hover:underline" onclick="selectStockForChart('${sym}')">${sym}</td>
                    <td class="text-xs font-semibold text-white">${cloudStatus}</td>
                    <td class="text-xs text-yellow-400 font-mono">${tkCross}</td>
                    <td class="text-xs text-slate-300 font-mono">${spanStatus}</td>
                    <td class="font-mono text-white">₹${ltp.toFixed(2)}</td>
                    <td><span class="badge-status ${isBuy ? 'badge-buy' : 'badge-sell'}">${sig}</span></td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    } catch (err) {
        console.error("Ichimoku error:", err);
    }
}

// Stock Trends (30M Interval Matrix)
async function loadStockTrends() {
    const tableBody = document.getElementById("stockTrendsTableBody");
    if (!tableBody) return;
    try {
        const res = await fetch("/api/stock_trends");
        const data = await res.json();
        let html = "";
        data.forEach(row => {
            const sym = row.SYMBOL || row.symbol;
            const ltp = row.LTP || row.ltp;
            
            function renderCell(val) {
                const isGreen = val === "GREEN" || val === "BUY" || val === true;
                const bg = isGreen ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-rose-500/20 text-rose-400 border border-rose-500/40";
                const icon = isGreen ? "▲" : "▼";
                return `<td class="py-2.5 px-1.5"><span class="inline-flex items-center justify-center w-7 h-6 rounded text-[11px] font-bold ${bg}">${icon}</span></td>`;
            }

            html += `
                <tr>
                    <td class="text-left font-bold text-cyan-400 cursor-pointer hover:underline" onclick="selectStockForChart('${sym}')">${sym}</td>
                    <td class="font-mono font-bold text-white">₹${Number(ltp).toFixed(2)}</td>
                    ${renderCell(row.CANDLE_1)}
                    ${renderCell(row.CANDLE_2)}
                    ${renderCell(row.CANDLE_3)}
                    ${renderCell(row.CANDLE_4)}
                    ${renderCell(row.CANDLE_5)}
                    ${renderCell(row.CANDLE_6)}
                    ${renderCell(row.CANDLE_7)}
                    ${renderCell(row.CANDLE_8)}
                    ${renderCell(row.CANDLE_9)}
                    ${renderCell(row.CANDLE_10)}
                    ${renderCell(row.CANDLE_11)}
                    ${renderCell(row.CANDLE_12)}
                    ${renderCell(row.CANDLE_13)}
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    } catch (err) {
        console.error("Stock Trends error:", err);
    }
}

// Technical Indicators Matrix
async function loadTechnicalIndicators() {
    const tableBody = document.getElementById("technicalIndicatorsTableBody");
    if (!tableBody) return;
    try {
        const res = await fetch("/api/technical_indicators");
        const data = await res.json();
        let html = "";
        data.forEach(row => {
            const sym = row.SYMBOL || row.symbol;
            const ltp = row.LTP || row.ltp;
            html += `
                <tr>
                    <td class="font-bold text-cyan-400 cursor-pointer hover:underline" onclick="selectStockForChart('${sym}')">${sym}</td>
                    <td class="font-mono font-bold text-white">₹${Number(ltp).toFixed(2)}</td>
                    <td class="font-mono text-yellow-400 text-xs">${row.ADX}</td>
                    <td class="font-mono text-slate-300 text-xs">₹${row.ATR}</td>
                    <td class="font-mono text-emerald-400 text-xs">${row.PDI}</td>
                    <td class="font-mono text-rose-400 text-xs">${row.MDI}</td>
                    <td class="font-mono text-cyan-300 text-xs">${row.MACD}</td>
                    <td class="font-mono text-emerald-300 text-xs">₹${row.BB_UP}</td>
                    <td class="font-mono text-rose-300 text-xs">₹${row.BB_LOW}</td>
                    <td class="font-mono font-bold ${row.RSI > 50 ? 'text-emerald-400' : 'text-rose-400'}">${row.RSI}</td>
                    <td class="font-mono text-slate-400 text-xs">${row.SLOWK}</td>
                    <td class="font-mono text-slate-400 text-xs">${row.SLOWD}</td>
                    <td><span class="badge-status badge-buy">${row["30Min"] || "BULLISH"}</span></td>
                    <td><span class="badge-status badge-buy">${row["60Min"] || "BULLISH"}</span></td>
                    <td><span class="badge-status badge-buy font-bold">${row["1Day"] || "STRONG"}</span></td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    } catch (err) {
        console.error("Technical Indicators error:", err);
    }
}

// Investment Trades (Long-Term Structural Plays)
async function loadInvestmentTrades() {
    const tableBody = document.getElementById("investmentsTableBody");
    if (!tableBody) return;
    try {
        const res = await fetch("/api/investments");
        const data = await res.json();
        let html = "";
        data.forEach(row => {
            const sym = row.SYMBOL || row.symbol;
            const strat = row.STRATEGY_CODE || row.strategy;
            const tf = row.TIMEPLAY || row.timeframe || "1-2 Years";
            const alert = row.ALERT || row.alert || "BUY";
            const ltp = row.LTP || row.ltp;
            const entry = row.ENTRY || row.entry;
            const t1 = row.TARGET_2 || row.t1 || row.target1;
            const t2 = row.TARGET_3 || row.t2 || row.target2;
            const t3 = row.TARGET || row.t3 || row.target3;
            const sl = row.STOPLOSS || row.sl || row.stoploss;
            const status = row.STATUS || row.status || "ACTIVE";
            html += `
                <tr>
                    <td class="font-bold text-cyan-400 cursor-pointer hover:underline" onclick="selectStockForChart('${sym}')">${sym}</td>
                    <td class="text-xs font-semibold text-white">${strat}</td>
                    <td class="text-xs font-mono text-slate-400">${tf}</td>
                    <td><span class="badge-status badge-buy">${alert}</span></td>
                    <td class="font-mono font-bold text-white">₹${Number(ltp).toFixed(2)}</td>
                    <td class="font-mono text-slate-300">₹${Number(entry).toFixed(2)}</td>
                    <td class="font-mono text-emerald-400 text-xs">₹${Number(t1).toFixed(2)}</td>
                    <td class="font-mono text-emerald-400 text-xs">₹${Number(t2).toFixed(2)}</td>
                    <td class="font-mono text-emerald-300 font-bold text-xs">₹${Number(t3).toFixed(2)}</td>
                    <td class="font-mono text-rose-400 text-xs">₹${Number(sl).toFixed(2)}</td>
                    <td><span class="badge-status badge-active">${status}</span></td>
                    <td>
                        <button onclick="openOrderModal('${sym}', ${ltp}, '${alert}', '${strat}')" class="btn-neotrader text-xs py-1 px-2.5">
                            INVEST
                        </button>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    } catch (err) {
        console.error("Investments error:", err);
    }
}

// 13. Turning Times [NEW]
async function loadTurningTimes() {
    const grid = document.getElementById("turningTimeGrid");
    if (!grid) return;
    try {
        const res = await fetch("/api/turning-times");
        const data = await res.json();
        let html = "";
        data.forEach(row => {
            html += `
                <div class="neo-card p-5 border-blue-500/30 bg-blue-950/20">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-2xl font-black font-mono text-cyan-400">${row.time_window}</span>
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500 text-slate-950">${row.countdown}</span>
                    </div>
                    <div class="font-bold text-white text-base mb-1">${row.cycle_name}</div>
                    <div class="text-xs text-emerald-400 font-semibold mb-2">Expected Bias: ${row.expected_bias}</div>
                    <div class="text-xs text-slate-400">Impact: ${row.impact_scope}</div>
                </div>
            `;
        });
        grid.innerHTML = html;
    } catch (err) {
        console.error("Turning time error:", err);
    }
}

// 14. Changed Now Feed
async function loadChangedNow() {
    const tableBody = document.getElementById("changedNowTableBody");
    if (!tableBody) return;
    try {
        const res = await fetch("/api/changed-now");
        const data = await res.json();
        let html = "";
        data.forEach(row => {
            html += `
                <tr>
                    <td class="font-mono text-xs text-slate-400">${row.time}</td>
                    <td class="font-bold text-cyan-400">${row.symbol}</td>
                    <td class="font-mono text-white">₹${row.ltp.toFixed(2)}</td>
                    <td class="text-xs font-semibold text-yellow-400">${row.event}</td>
                    <td><span class="badge-status badge-buy">${row.action}</span></td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    } catch (err) {
        console.error("Changed now error:", err);
    }
}

// 15. Sector Performance & Heatmap
async function loadSectorView() {
    const grid = document.getElementById("sectorGrid");
    if (!grid) return;
    try {
        const res = await fetch("/api/sector-view");
        const data = await res.json();
        let html = "";
        data.forEach(sec => {
            const isUp = sec.is_positive;
            const borderCol = isUp ? "border-emerald-500/30" : "border-rose-500/30";
            const bgGlow = isUp ? "bg-emerald-950/20" : "bg-rose-950/20";
            const txtCol = isUp ? "text-emerald-400" : "text-rose-400";
            const sign = sec.avg_change >= 0 ? "+" : "";

            html += `
                <div class="neo-card ${borderCol} ${bgGlow} p-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold text-sm text-white">${sec.sector}</span>
                        <span class="font-bold text-base ${txtCol}">${sign}${sec.avg_change}%</span>
                    </div>
                    <div class="text-xs text-slate-400 flex justify-between mb-3">
                        <span>Adv: <strong class="text-emerald-400">${sec.advances}</strong></span>
                        <span>Dec: <strong class="text-rose-400">${sec.declines}</strong></span>
                        <span>Top: <strong class="text-cyan-400">${sec.top_stock}</strong></span>
                    </div>
                    <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                        <div class="bg-emerald-500 h-full" style="width: ${(sec.advances / Math.max(sec.count, 1)) * 100}%"></div>
                        <div class="bg-rose-500 h-full" style="width: ${(sec.declines / Math.max(sec.count, 1)) * 100}%"></div>
                    </div>
                </div>
            `;
        });
        grid.innerHTML = html;
    } catch (err) {
        console.error("Sector error:", err);
    }
}

// 16. Options Radar
async function loadOptionsRadar() {
    const tableBody = document.getElementById("optionsTableBody");
    if (!tableBody) return;
    try {
        const res = await fetch("/api/options-alerts");
        const data = await res.json();
        let html = "";
        data.forEach(opt => {
            html += `
                <tr>
                    <td class="font-bold text-white">${opt.symbol}</td>
                    <td class="font-semibold text-cyan-400">₹${opt.spot.toFixed(2)}</td>
                    <td class="font-bold text-yellow-400">₹${opt.atm_strike}</td>
                    <td class="text-xs text-slate-300 font-mono">${opt.short_atm_straddle_1}</td>
                    <td class="text-xs text-emerald-400 font-mono">${opt.long_atm_call_1}</td>
                    <td class="text-xs text-rose-400 font-mono">${opt.long_atm_put_1}</td>
                    <td class="font-bold text-slate-200 font-mono">${opt.pcr}</td>
                    <td class="text-slate-300 font-mono">${opt.iv}%</td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    } catch (err) {
        console.error("Options error:", err);
    }
}

// 17. Query Window Custom Filter Execution
window.runCustomQuery = function() {
    const price = document.getElementById("queryPriceFilter").value;
    const rsi = document.getElementById("queryRsiFilter").value;
    const cam = document.getElementById("queryCamFilter").value;
    const tbody = document.getElementById("queryResultsTableBody");
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td class="font-bold text-cyan-400">RELIANCE</td>
            <td class="font-mono text-white">₹3,012.40</td>
            <td class="font-mono text-emerald-400">64.2</td>
            <td><span class="badge-status badge-buy">ABOVE H4 BREAKOUT</span></td>
            <td class="font-mono text-yellow-400 font-bold">2.8x Vol</td>
            <td><button class="btn-neotrader text-xs py-1 px-2.5" onclick="quickTrade('RELIANCE', 'BUY', 3012.0, 3012.4)">TRADE</button></td>
        </tr>
        <tr>
            <td class="font-bold text-cyan-400">TATAMOTORS</td>
            <td class="font-mono text-white">₹982.60</td>
            <td class="font-mono text-emerald-400">68.5</td>
            <td><span class="badge-status badge-buy">ABOVE H3 RESISTANCE</span></td>
            <td class="font-mono text-yellow-400 font-bold">1.9x Vol</td>
            <td><button class="btn-neotrader text-xs py-1 px-2.5" onclick="quickTrade('TATAMOTORS', 'BUY', 980.0, 982.6)">TRADE</button></td>
        </tr>
        <tr>
            <td class="font-bold text-cyan-400">TCS</td>
            <td class="font-mono text-white">₹3,940.00</td>
            <td class="font-mono text-emerald-400">59.8</td>
            <td><span class="badge-status badge-active">PIVOT PULLBACK</span></td>
            <td class="font-mono text-yellow-400 font-bold">1.4x Vol</td>
            <td><button class="btn-neotrader text-xs py-1 px-2.5" onclick="quickTrade('TCS', 'BUY', 3935.0, 3940.0)">TRADE</button></td>
        </tr>
    `;
};

// 18. Watchlist Management
async function loadWatchlist() {
    const tableBody = document.getElementById("watchlistTableBody");
    if (!tableBody) return;
    try {
        const res = await fetch("/api/watchlist");
        const data = await res.json();
        let html = "";
        data.forEach(row => {
            const isUp = row.is_up;
            const sign = isUp ? "+" : "";
            const colorClass = isUp ? "text-emerald-400" : "text-rose-400";
            html += `
                <tr>
                    <td class="font-bold text-cyan-400 cursor-pointer hover:underline" onclick="selectStockForChart('${row.symbol}')">${row.symbol}</td>
                    <td class="font-mono font-bold text-white">₹${row.ltp.toFixed(2)}</td>
                    <td class="font-mono ${colorClass}">${sign}₹${row.chg.toFixed(2)}</td>
                    <td class="font-mono font-bold ${colorClass}">${sign}${row.chg_pct}%</td>
                    <td class="space-x-2">
                        <button class="btn-neotrader text-xs py-1 px-2.5" onclick="quickTrade('${row.symbol}', 'BUY', ${row.ltp}, ${row.ltp})">BUY</button>
                        <button class="btn-outline-neon text-xs py-1 px-2 text-rose-400 border-rose-500/40" onclick="removeSymbolFromWatchlist('${row.symbol}')"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    } catch (err) {
        console.error("Watchlist error:", err);
    }
}

window.addSymbolToWatchlist = async function() {
    const input = document.getElementById("addWatchlistInput");
    if (!input || !input.value.trim()) return;
    const sym = input.value.trim().toUpperCase();
    await fetch(`/api/watchlist/${sym}`, { method: "POST" });
    input.value = "";
    loadWatchlist();
};

window.removeSymbolFromWatchlist = async function(symbol) {
    await fetch(`/api/watchlist/${symbol}`, { method: "DELETE" });
    loadWatchlist();
};

// 19. Stock Analyser
window.analyseSelectedStock = function() {
    const sym = (document.getElementById("analyserSymbolInput").value || "RELIANCE").toUpperCase();
    document.getElementById("analyser30MStatus").innerText = `${sym}: Strong Bullish Confluence`;
    document.getElementById("analyser1DStatus").innerText = `${sym}: Trend Following Mode`;
    document.getElementById("analyser1WStatus").innerText = `${sym}: Higher Low Breakout`;
};

// 20. Paper Trades
async function loadPaperTrades() {
    const tableBody = document.getElementById("paperTradesTableBody");
    const totalPnlEl = document.getElementById("totalPaperPnl");
    if (!tableBody) return;
    try {
        const res = await fetch("/api/paper-trades");
        const trades = await res.json();
        let totalPnl = 0;
        let html = "";
        trades.forEach(t => {
            totalPnl += t.pnl;
            const pnlCol = t.pnl >= 0 ? "text-emerald-400" : "text-rose-400";
            const sign = t.pnl >= 0 ? "+" : "";
            html += `
                <tr>
                    <td class="font-mono text-slate-400">#${t.id}</td>
                    <td class="font-bold text-white">${t.symbol}</td>
                    <td><span class="badge-status ${t.alert === 'BUY' ? 'badge-buy' : 'badge-sell'}">${t.alert}</span></td>
                    <td class="font-mono text-slate-300">${t.qty}</td>
                    <td class="font-mono text-slate-300">₹${t.entry_price.toFixed(2)}</td>
                    <td class="font-mono text-cyan-400">₹${t.current_price.toFixed(2)}</td>
                    <td class="font-bold font-mono ${pnlCol}">${sign}₹${t.pnl.toFixed(2)}</td>
                    <td><span class="badge-status badge-active">${t.status}</span></td>
                    <td>
                        ${t.status === 'ACTIVE' ? `
                            <button class="btn-outline-neon text-xs py-1 px-3 text-rose-400 border-rose-500/40 hover:bg-rose-500/20" onclick="closePaperTrade(${t.id})">
                                EXIT
                            </button>
                        ` : '<span class="text-slate-500 text-xs">CLOSED</span>'}
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html || `<tr><td colspan="9" class="text-center py-6 text-slate-400">No paper trades placed yet.</td></tr>`;
        if (totalPnlEl) {
            totalPnlEl.className = `text-xl font-black font-mono ${totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;
            totalPnlEl.innerText = `${totalPnl >= 0 ? '+' : ''}₹${totalPnl.toFixed(2)}`;
        }
    } catch (err) {
        console.error("Paper trades error:", err);
    }
}

window.closePaperTrade = async function(id) {
    await fetch(`/api/paper-trades/${id}`, { method: "DELETE" });
    loadPaperTrades();
};

window.quickTrade = function(symbol, alert, entry, ltp) {
    activeTradeToOrder = {
        SYMBOL: symbol,
        STRATEGY_CODE: "QUICK TRADE",
        ALERT: alert,
        ENTRY: entry,
        LTP: ltp,
        TARGET_2: alert === "BUY" ? entry * 1.015 : entry * 0.985,
        TARGET_3: alert === "BUY" ? entry * 1.03 : entry * 0.97,
        STOPLOSS: alert === "BUY" ? entry * 0.99 : entry * 1.01
    };
    const modal = document.getElementById("orderModal");
    if (!modal) return;
    document.getElementById("orderModalSymbol").innerText = `${alert} ${symbol}`;
    document.getElementById("orderModalStrategy").innerText = `QUICK TRADE ROUTE`;
    document.getElementById("orderModalPrice").innerText = `Trigger: ₹${entry.toFixed(2)} | LTP: ₹${ltp.toFixed(2)}`;
    document.getElementById("orderModalTargets").innerText = `T1: ₹${activeTradeToOrder.TARGET_2.toFixed(2)} | SL: ₹${activeTradeToOrder.STOPLOSS.toFixed(2)}`;
    modal.style.display = "flex";
};

// 1-Click Order Modal
function setupOrderModal() {
    const modal = document.getElementById("orderModal");
    const closeBtn = document.getElementById("closeOrderModal");
    const form = document.getElementById("orderExecutionForm");
    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => modal.style.display = "none");
    }
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!activeTradeToOrder) return;
            const broker = document.getElementById("orderBrokerSelect").value;
            const qty = parseInt(document.getElementById("orderQtyInput").value) || 50;

            const payload = {
                symbol: activeTradeToOrder.SYMBOL,
                strategy: activeTradeToOrder.STRATEGY_CODE,
                alert: activeTradeToOrder.ALERT,
                entry_price: activeTradeToOrder.ENTRY,
                current_price: activeTradeToOrder.LTP,
                target1: activeTradeToOrder.TARGET_2,
                target2: activeTradeToOrder.TARGET_3,
                stoploss: activeTradeToOrder.STOPLOSS,
                qty: qty,
                broker: broker
            };

            const res = await fetch("/api/paper-trade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (window.Swal) {
                Swal.fire({
                    icon: "success",
                    title: "Order Executed!",
                    text: result.message,
                    background: "#1a1e2e",
                    color: "#fff",
                    confirmButtonColor: "#33D6AD"
                });
            } else {
                alert(result.message);
            }
            modal.style.display = "none";
            loadPaperTrades();
        });
    }
}

window.openOrderModal = function(recordId) {
    const trade = currentTrades.find(t => t.RecordID === recordId);
    if (!trade) return;
    activeTradeToOrder = trade;
    const modal = document.getElementById("orderModal");
    if (!modal) return;
    document.getElementById("orderModalSymbol").innerText = `${trade.ALERT} ${trade.SYMBOL}`;
    document.getElementById("orderModalStrategy").innerText = `${trade.STRATEGY_CODE} (${trade.TIMEPLAY})`;
    document.getElementById("orderModalPrice").innerText = `Trigger: ₹${trade.ENTRY} | LTP: ₹${trade.LTP}`;
    document.getElementById("orderModalTargets").innerText = `T1: ₹${trade.TARGET_2} | T2: ₹${trade.TARGET_3} | SL: ₹${trade.STOPLOSS}`;
    modal.style.display = "flex";
};

// Setup Filters
function setupFilters() {
    ["filterStrategy", "filterStatus", "filterAlert"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("change", () => loadIntradayTrades());
    });
    const searchInput = document.getElementById("searchTrades");
    if (searchInput) {
        searchInput.addEventListener("input", () => renderTradesTable(currentTrades));
    }
    const autoRefreshToggle = document.getElementById("autoRefreshCheckbox");
    if (autoRefreshToggle) {
        autoRefreshToggle.addEventListener("change", (e) => {
            if (e.target.checked) {
                autoRefreshTimer = setInterval(loadIntradayTrades, 5000);
            } else {
                clearInterval(autoRefreshTimer);
            }
        });
        autoRefreshTimer = setInterval(loadIntradayTrades, 5000);
    }
}

// Interactive Candlestick Chart
let chartSymbol = "RELIANCE";

window.selectStockForChart = function(symbol) {
    chartSymbol = symbol;
    switchTab("charts");
};

function initCandlestickChart() {}

function renderChart() {
    const canvas = document.getElementById("candlestickCanvas");
    const label = document.getElementById("chartSymbolLabel");
    if (!canvas) return;
    if (label) label.innerText = `${chartSymbol} (NSE) - Realtime Candlesticks & Camarilla Levels`;

    const ctx = canvas.getContext("2d");
    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = 420;

    ctx.clearRect(0, 0, width, height);

    const candles = [];
    let basePrice = chartSymbol === "RELIANCE" ? 3000 : (chartSymbol === "HDFCBANK" ? 1530 : 1660);
    let cur = basePrice;
    for (let i = 0; i < 35; i++) {
        const open = cur;
        const delta = (Math.random() - 0.48) * (basePrice * 0.008);
        const close = open + delta;
        const high = Math.max(open, close) + Math.random() * (basePrice * 0.004);
        const low = Math.min(open, close) - Math.random() * (basePrice * 0.004);
        candles.push({ open, high, low, close });
        cur = close;
    }

    const minPrice = Math.min(...candles.map(c => c.low)) * 0.996;
    const maxPrice = Math.max(...candles.map(c => c.high)) * 1.004;

    function priceToY(p) {
        return height - 40 - ((p - minPrice) / (maxPrice - minPrice)) * (height - 80);
    }

    ctx.strokeStyle = "#23283c";
    ctx.lineWidth = 1;
    for (let p = minPrice; p <= maxPrice; p += (maxPrice - minPrice) / 6) {
        const y = priceToY(p);
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(width - 60, y);
        ctx.stroke();

        ctx.fillStyle = "#64748b";
        ctx.font = "11px monospace";
        ctx.fillText(`₹${p.toFixed(1)}`, width - 55, y + 4);
    }

    const lastClose = candles[candles.length - 1].close;
    const rng = (maxPrice - minPrice) * 0.4;
    const h4 = lastClose + rng * 0.55;
    const h3 = lastClose + rng * 0.275;
    const l3 = lastClose - rng * 0.275;
    const l4 = lastClose - rng * 0.55;

    function drawPivotLine(y, label, color) {
        ctx.strokeStyle = color;
        ctx.setLineDash([6, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(width - 60, y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = color;
        ctx.font = "bold 11px sans-serif";
        ctx.fillText(label, 45, y - 5);
    }

    drawPivotLine(priceToY(h4), "H4 BREAKOUT", "#34d399");
    drawPivotLine(priceToY(h3), "H3 RESISTANCE", "#10b981");
    drawPivotLine(priceToY(l3), "L3 SUPPORT", "#fb7185");
    drawPivotLine(priceToY(l4), "L4 BREAKDOWN", "#ef4444");

    const candleWidth = Math.max(6, (width - 120) / candles.length - 6);
    candles.forEach((c, idx) => {
        const x = 50 + idx * (candleWidth + 6);
        const yOpen = priceToY(c.open);
        const yClose = priceToY(c.close);
        const yHigh = priceToY(c.high);
        const yLow = priceToY(c.low);
        const isGreen = c.close >= c.open;

        ctx.strokeStyle = isGreen ? "#10b981" : "#ef4444";
        ctx.fillStyle = isGreen ? "#10b981" : "#ef4444";

        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + candleWidth / 2, yHigh);
        ctx.lineTo(x + candleWidth / 2, yLow);
        ctx.stroke();

        const topY = Math.min(yOpen, yClose);
        const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));
        ctx.fillRect(x, topY, candleWidth, bodyHeight);
    });
}
