from datetime import datetime, timedelta
import random
from app.market_simulator import market_sim, get_ist_now

def generate_options_trades():
    return [
        {"RecordID": 1, "STRATEGY": "OPT-1", "SYMBOL": "HDFCLIFE 26 SEP 560 CE", "ALERT": "LONG", "SIGNAL_DT": "2026-09-21 14:20:34", "STATUS": "ACTIVE", "ENTRY": 9.5, "T1": 12.35, "T2": 14.25, "T3": 19.0, "SL": 4.75, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00"},
        {"RecordID": 2, "STRATEGY": "IDX-OPT", "SYMBOL": "NIFTY 26 SEP 29 23450 CE", "ALERT": "LONG", "SIGNAL_DT": "2026-09-21 14:03:58", "STATUS": "ACTIVE", "ENTRY": 149.2, "T1": 186.5, "T2": 223.8, "T3": 261.1, "SL": 74.6, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "2026-09-21 14:03:58"},
        {"RecordID": 3, "STRATEGY": "IDX-OPT", "SYMBOL": "BANKNIFTY 26 SEP 29 56500 CE", "ALERT": "LONG", "SIGNAL_DT": "2026-09-21 14:03:58", "STATUS": "ACTIVE", "ENTRY": 494.3, "T1": 617.88, "T2": 741.45, "T3": 865.03, "SL": 247.15, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "2026-09-21 14:03:58"},
        {"RecordID": 4, "STRATEGY": "IDX-OPT", "SYMBOL": "BANKNIFTY 26 SEP 29 56500 CE", "ALERT": "LONG", "SIGNAL_DT": "2026-09-21 13:33:57", "STATUS": "ACTIVE", "ENTRY": 501.0, "T1": 626.25, "T2": 751.5, "T3": 876.75, "SL": 250.5, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "2026-09-21 13:33:57"},
        {"RecordID": 5, "STRATEGY": "OPT-1", "SYMBOL": "HDFCLIFE 26 SEP 560 CE", "ALERT": "LONG", "SIGNAL_DT": "2026-09-21 09:50:28", "STATUS": "EXIT", "ENTRY": 8.75, "T1": 11.38, "T2": 13.13, "T3": 17.5, "SL": 4.38, "TRADE": "CLOSED", "EXIT": 8.9, "UPDATE_DT": "2026-09-21 14:20:34"},
        {"RecordID": 6, "STRATEGY": "OPT-1", "SYMBOL": "GLENMARK 26 SEP 2460 CE", "ALERT": "LONG", "SIGNAL_DT": "2026-09-21 09:50:28", "STATUS": "ACTIVE", "ENTRY": 40.8, "T1": 53.04, "T2": 61.2, "T3": 81.6, "SL": 20.4, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00"},
        {"RecordID": 7, "STRATEGY": "IDX-OPT", "SYMBOL": "NIFTY 26 SEP 29 23400 CE", "ALERT": "LONG", "SIGNAL_DT": "2026-09-21 09:48:58", "STATUS": "ACTIVE", "ENTRY": 153.9, "T1": 192.38, "T2": 230.85, "T3": 269.33, "SL": 76.95, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "2026-09-21 09:48:58"},
        {"RecordID": 8, "STRATEGY": "IDX-OPT", "SYMBOL": "NIFTY 26 SEP 29 23350 CE", "ALERT": "LONG", "SIGNAL_DT": "2026-09-21 09:33:53", "STATUS": "ACTIVE", "ENTRY": 184.05, "T1": 230.06, "T2": 276.08, "T3": 322.09, "SL": 92.03, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "2026-09-21 09:33:53"},
        {"RecordID": 9, "STRATEGY": "OPT-1", "SYMBOL": "TATASTEEL 26 SEP 18 7.5CE", "ALERT": "LONG", "SIGNAL_DT": "2026-09-17 14:50:32", "STATUS": "SL MET", "ENTRY": 4.39, "T1": 5.71, "T2": 6.59, "T3": 8.78, "SL": 2.2, "TRADE": "CLOSED", "EXIT": 2.195, "UPDATE_DT": "2026-09-21 09:20:09"},
        {"RecordID": 10, "STRATEGY": "OPT-1", "SYMBOL": "RECLTD 26 SEP 315 CE", "ALERT": "LONG", "SIGNAL_DT": "2026-09-16 14:20:30", "STATUS": "SL MET", "ENTRY": 6.35, "T1": 8.26, "T2": 9.53, "T3": 12.7, "SL": 3.18, "TRADE": "CLOSED", "EXIT": 3.175, "UPDATE_DT": "2026-09-18 09:33:41"}
    ]

def generate_intraday_trades():
    return [
        {"RecordID": 1, "STRATEGY": "REVERSAL-3", "TIMEPLAY": "OVERNIGHT", "SYMBOL": "PATANJALI", "RECENT_VALUE": 396.2, "ALERT": "SHORT", "ENTRY": 396.5, "SIGNAL_DT": "2026-09-21 14:21:07", "SL": 401.8, "STATUS": "ACTIVE", "T1": 392.0, "T2": 388.5, "T3": 383.8, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "2026-09-21 14:21:07", "SUMMARY": [0, 0, 0, 0]},
        {"RecordID": 2, "STRATEGY": "DAWN", "TIMEPLAY": "INTRADAY", "SYMBOL": "POLICYBZR", "RECENT_VALUE": 1793.0, "ALERT": "LONG", "ENTRY": 1784.9, "SIGNAL_DT": "2026-09-21 13:24:16", "SL": 1761.3, "STATUS": "T1 MET", "T1": 1795.3, "T2": 1816.3, "T3": 1850.3, "TRADE": "CLOSED", "EXIT": 1795.3, "UPDATE_DT": "2026-09-21 13:58:09", "SUMMARY": [1, 0, 0, 0]},
        {"RecordID": 3, "STRATEGY": "REVERSAL-3", "TIMEPLAY": "OVERNIGHT", "SYMBOL": "MANKIND", "RECENT_VALUE": 2437.8, "ALERT": "SHORT", "ENTRY": 2439.5, "SIGNAL_DT": "2026-09-21 13:20:55", "SL": 2472.4, "STATUS": "ACTIVE", "T1": 2412.1, "T2": 2390.1, "T3": 2382.2, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "2026-09-21 13:20:55", "SUMMARY": [0, 0, 0, 0]},
        {"RecordID": 4, "STRATEGY": "DAWN", "TIMEPLAY": "INTRADAY", "SYMBOL": "CHOLAFIN", "RECENT_VALUE": 1764.0, "ALERT": "SHORT", "ENTRY": 1775.2, "SIGNAL_DT": "2026-09-21 12:33:23", "SL": 1790.1, "STATUS": "T1 MET", "T1": 1766.4, "T2": 1751.7, "T3": 1728.0, "TRADE": "CLOSED", "EXIT": 1766.4, "UPDATE_DT": "2026-09-21 13:11:52", "SUMMARY": [1, 0, 0, 0]},
        {"RecordID": 5, "STRATEGY": "REVERSAL-3", "TIMEPLAY": "OVERNIGHT", "SYMBOL": "MANKIND", "RECENT_VALUE": 2437.8, "ALERT": "SHORT", "ENTRY": 2430.0, "SIGNAL_DT": "2026-09-21 11:20:54", "SL": 2462.8, "STATUS": "ACTIVE", "T1": 2402.7, "T2": 2380.8, "T3": 2372.5, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "2026-09-21 11:20:54", "SUMMARY": [0, 0, 0, 0]},
        {"RecordID": 6, "STRATEGY": "REVERSAL-3", "TIMEPLAY": "INTRADAY", "SYMBOL": "MANKIND", "RECENT_VALUE": 2437.8, "ALERT": "SHORT", "ENTRY": 2430.0, "SIGNAL_DT": "2026-09-21 11:20:18", "SL": 2457.3, "STATUS": "EXIT", "T1": 2402.7, "T2": 2388.1, "T3": 2388.1, "TRADE": "CLOSED", "EXIT": 2440.4, "UPDATE_DT": "2026-09-21 13:50:21", "SUMMARY": [0, 0, 0, 0]},
        {"RecordID": 7, "STRATEGY": "BREAKOUT-1", "TIMEPLAY": "INTRADAY", "SYMBOL": "SIEMENS", "RECENT_VALUE": 3887.0, "ALERT": "LONG", "ENTRY": 3898.2, "SIGNAL_DT": "2026-09-21 10:39:12", "SL": 3862.9, "STATUS": "EXIT", "T1": 3927.8, "T2": 3957.1, "T3": 3996.1, "TRADE": "CLOSED", "EXIT": 3912.0, "UPDATE_DT": "2026-09-21 14:45:00", "SUMMARY": [1, 0, 0, 0]},
        {"RecordID": 8, "STRATEGY": "BREAKOUT-1", "TIMEPLAY": "INTRADAY", "SYMBOL": "IDEA", "RECENT_VALUE": 13.84, "ALERT": "SHORT", "ENTRY": 14.0, "SIGNAL_DT": "2026-09-21 09:47:17", "SL": 14.1, "STATUS": "EXIT", "T1": 13.9, "T2": 13.8, "T3": 13.6, "TRADE": "CLOSED", "EXIT": 14.0, "UPDATE_DT": "2026-09-21 14:45:00", "SUMMARY": [-1, 0, 0, 0]}
    ]

# 1. Exact Heikin Ashi Patterns
def generate_heikin_ashi_patterns():
    return {
        "top_cards": {
            "new_trend": {"bullish": 0, "bearish": 6, "stocks": []},
            "confirmed_trend": {"bullish": 0, "bearish": 0, "stocks": []},
            "reverse_trend": {"bullish": 2, "bearish": 0, "stocks": ["BEL", "ABB"]},
            "continue_trend": {"bullish": 2, "bearish": 1, "stocks": ["WIPRO", "KAYNES"]}
        },
        "table": [
            {"RecordID": 1, "SYMBOL": "ADANIENT", "RECENT_VALUE": 2975.0, "SMALL_BODY": 0, "LONG_BODY": 0, "MODERATE_BODY": 0, "CONFIRMED_TREND": 0, "CONTINUE_TREND": 0, "NEW_TREND": 0, "REVERSE_TREND": 0, "TIMEFRAME": "30Min", "TIMESTAMP": "2026-09-21 15:30:48"},
            {"RecordID": 2, "SYMBOL": "APOLLOHOSP", "RECENT_VALUE": 8912.0, "SMALL_BODY": -1, "LONG_BODY": 0, "MODERATE_BODY": 0, "CONFIRMED_TREND": 0, "CONTINUE_TREND": 0, "NEW_TREND": 0, "REVERSE_TREND": 0, "TIMEFRAME": "30Min", "TIMESTAMP": "2026-09-21 15:30:48"},
            {"RecordID": 3, "SYMBOL": "ASIANPAINT", "RECENT_VALUE": 2440.3, "SMALL_BODY": 0, "LONG_BODY": -1, "MODERATE_BODY": 0, "CONFIRMED_TREND": 0, "CONTINUE_TREND": 0, "NEW_TREND": 0, "REVERSE_TREND": 0, "TIMEFRAME": "30Min", "TIMESTAMP": "2026-09-21 15:30:48"},
            {"RecordID": 4, "SYMBOL": "BAJFINANCE", "RECENT_VALUE": 1021.3, "SMALL_BODY": 0, "LONG_BODY": 0, "MODERATE_BODY": 0, "CONFIRMED_TREND": 0, "CONTINUE_TREND": 0, "NEW_TREND": 0, "REVERSE_TREND": 0, "TIMEFRAME": "30Min", "TIMESTAMP": "2026-09-21 15:30:48"},
            {"RecordID": 5, "SYMBOL": "BEL", "RECENT_VALUE": 398.5, "SMALL_BODY": -1, "LONG_BODY": 0, "MODERATE_BODY": 0, "CONFIRMED_TREND": 0, "CONTINUE_TREND": 0, "NEW_TREND": 0, "REVERSE_TREND": 1, "TIMEFRAME": "30Min", "TIMESTAMP": "2026-09-21 15:30:48"},
            {"RecordID": 6, "SYMBOL": "HDFCLIFE", "RECENT_VALUE": 559.4, "SMALL_BODY": 0, "LONG_BODY": 0, "MODERATE_BODY": -1, "CONFIRMED_TREND": 0, "CONTINUE_TREND": 0, "NEW_TREND": 0, "REVERSE_TREND": 0, "TIMEFRAME": "30Min", "TIMESTAMP": "2026-09-21 15:30:48"},
            {"RecordID": 7, "SYMBOL": "CIPLA", "RECENT_VALUE": 1386.1, "SMALL_BODY": 0, "LONG_BODY": 0, "MODERATE_BODY": 0, "CONFIRMED_TREND": 0, "CONTINUE_TREND": 0, "NEW_TREND": 0, "REVERSE_TREND": 0, "TIMEFRAME": "30Min", "TIMESTAMP": "2026-09-21 15:30:48"},
            {"RecordID": 8, "SYMBOL": "DRREDDY", "RECENT_VALUE": 1198.3, "SMALL_BODY": 1, "LONG_BODY": 0, "MODERATE_BODY": 0, "CONFIRMED_TREND": 0, "CONTINUE_TREND": 0, "NEW_TREND": 0, "REVERSE_TREND": 0, "TIMEFRAME": "30Min", "TIMESTAMP": "2026-09-21 15:30:48"},
            {"RecordID": 9, "SYMBOL": "EICHERMOT", "RECENT_VALUE": 7512.5, "SMALL_BODY": 0, "LONG_BODY": 0, "MODERATE_BODY": 0, "CONFIRMED_TREND": 0, "CONTINUE_TREND": 0, "NEW_TREND": 0, "REVERSE_TREND": 0, "TIMEFRAME": "30Min", "TIMESTAMP": "2026-09-21 15:30:48"},
            {"RecordID": 10, "SYMBOL": "GRASIM", "RECENT_VALUE": 3166.0, "SMALL_BODY": 0, "LONG_BODY": -1, "MODERATE_BODY": 0, "CONFIRMED_TREND": 0, "CONTINUE_TREND": 0, "NEW_TREND": 0, "REVERSE_TREND": 0, "TIMEFRAME": "30Min", "TIMESTAMP": "2026-09-21 15:30:48"}
        ]
    }

# 2. Exact CPR (Central Pivot Range)
def generate_cpr_pivots():
    results = []
    for idx, (sym, st) in enumerate(market_sim.stocks.items(), start=1):
        if st["type"] == "INDEX":
            continue
        H, L, C = st["high"], st["low"], st["ltp"]
        P = round((H + L + C) / 3.0, 2)
        BC = round((H + L) / 2.0, 2)
        TC = round((P - BC) + P, 2)
        r1 = round((2 * P) - L, 2)
        s1 = round((2 * P) - H, 2)
        width_pct = round((abs(TC - BC) / max(C, 1.0)) * 100, 2)
        
        # Next day projections
        next_p = round((H + L + C) / 3.0 + random.uniform(-5, 5), 2)
        next_bc = round((H + L) / 2.0 + random.uniform(-5, 5), 2)
        next_tc = round((next_p - next_bc) + next_p, 2)
        next_r1 = round((2 * next_p) - L, 2)
        next_s1 = round((2 * next_p) - H, 2)

        results.append({
            "RecordID": idx,
            "SYMBOL": sym,
            "LTP": C,
            "P": P,
            "TC": TC,
            "BC": BC,
            "R1": r1,
            "S1": s1,
            "HIGH": H,
            "LOW": L,
            "CPR_WIDTH": width_pct,
            "TIMEFRAME": "Daily",
            "NEXT_R1": next_r1,
            "NEXT_S1": next_s1,
            "NEXT_TC": next_tc,
            "NEXT_P": next_p,
            "NEXT_BC": next_bc
        })
    return results

# 3. Exact Fibonacci Pivots
def generate_fibonacci_pivots():
    results = []
    for idx, (sym, st) in enumerate(market_sim.stocks.items(), start=1):
        if st["type"] == "INDEX":
            continue
        H, L, C = st["high"], st["low"], st["ltp"]
        rng = H - L
        P = round((H + L + C) / 3.0, 2)
        results.append({
            "RecordID": idx,
            "SYMBOL": sym,
            "LTP": C,
            "R4": round(P + (1.618 * rng), 2),
            "R3": round(P + (1.000 * rng), 2),
            "R2": round(P + (0.618 * rng), 2),
            "R1": round(P + (0.382 * rng), 2),
            "TIME_FRAME": "Daily",
            "PIVOT": P,
            "S1": round(P - (0.382 * rng), 2),
            "S2": round(P - (0.618 * rng), 2),
            "S3": round(P - (1.000 * rng), 2),
            "S4": round(P - (1.618 * rng), 2),
        })
    return results

# 4. Exact ADX Trending Scanner
def generate_adx_trends():
    results = []
    for idx, (sym, st) in enumerate(market_sim.stocks.items(), start=1):
        if st["type"] == "INDEX":
            continue
        adx = round(random.uniform(16.0, 48.0), 1)
        pdi = round(random.uniform(18.0, 36.0), 1)
        mdi = round(random.uniform(14.0, 34.0), 1)
        results.append({
            "RecordID": idx,
            "SYMBOL": sym,
            "LTP": st["ltp"],
            "TIMEFRAME": "30Min",
            "ADX_SCORE": "STRONG (8/10)" if adx > 25 else "MILD (4/10)",
            "DIRSTR": "BULL (+DI > -DI)" if pdi > mdi else "BEAR (-DI > +DI)",
            "PDI": pdi,
            "MDI": mdi,
            "ADX": adx
        })
    return results

# 5. Exact ATR Trends
def generate_atr_trends():
    results = []
    for idx, (sym, st) in enumerate(market_sim.stocks.items(), start=1):
        if st["type"] == "INDEX":
            continue
        atr = round(st["ltp"] * random.uniform(0.012, 0.024), 2)
        results.append({
            "RecordID": idx,
            "SYMBOL": sym,
            "TIMEFRAME": "Daily",
            "ATR": atr,
            "LTP": st["ltp"],
            "ATR_ST": "EXPANSION (HIGH VOL)" if atr > (st["ltp"] * 0.018) else "NORMAL",
            "LOW": st["low"],
            "HIGH": st["high"]
        })
    return results

# 6. Exact RSI Trends
def generate_rsi_trends():
    results = []
    for idx, (sym, st) in enumerate(market_sim.stocks.items(), start=1):
        if st["type"] == "INDEX":
            continue
        rsi30 = round(random.uniform(35.0, 75.0), 1)
        rsi60 = round(random.uniform(38.0, 72.0), 1)
        rsiD = round(random.uniform(40.0, 70.0), 1)
        rsiW = round(random.uniform(45.0, 68.0), 1)
        rsiM = round(random.uniform(50.0, 65.0), 1)

        results.append({
            "RecordID": idx,
            "SYMBOL": sym,
            "LTP": st["ltp"],
            "T_RSI": rsi30,
            "S_RSI": rsi60,
            "D_RSI": rsiD,
            "W_RSI": rsiW,
            "M_RSI": rsiM,
            "TURNUP": "YES" if rsi30 > 50 and rsi30 < 60 else "NO",
            "TURNDOWN": "YES" if rsi30 < 45 else "NO",
            "BREAKOUT": "BULL BREAKOUT (>60)" if rsi30 > 60 else "NORMAL",
            "BREAKDOWN": "BEAR BREAKDOWN (<40)" if rsi30 < 40 else "NORMAL"
        })
    return results

# 7. Exact Candlestick Alerts
def generate_candlestick_alerts():
    return {
        "trending_up": [
            {"sym": "AARTIIND", "score": 46, "consec": 3},
            {"sym": "AEGISLOG", "score": 46, "consec": 2},
            {"sym": "LTFOODS", "score": 46, "consec": 0},
            {"sym": "NESTLEIND", "score": 46, "consec": 4},
            {"sym": "NIFTYIT", "score": 46, "consec": 0}
        ],
        "trending_down": [
            {"sym": "CASTROLIND", "score": -73, "consec": 1},
            {"sym": "ANANTRAJ", "score": -66, "consec": 2},
            {"sym": "HINDALCO", "score": -66, "consec": 2},
            {"sym": "INDIGO", "score": -66, "consec": 2},
            {"sym": "SONACOMS", "score": -60, "consec": 1}
        ],
        "stats": {
            "trending_up": 37,
            "trending_down": 24,
            "hammer": 0,
            "shooting_star": 0,
            "long_reversal": 2,
            "spinning_top": 2,
            "doji": 9,
            "engulfing": 0,
            "longline": 84,
            "short_reversal": 2
        },
        "cards": {
            "hammer": [],
            "shooting_star": [],
            "doji": ["ACE", "DLF", "EMMVEE", "INDIGO", "LEMONTREE", "LTFOODS", "MUTHOOTFIN", "NH", "WIPRO"],
            "short_exhaustion": ["AJANTPHARM", "GODREJPROP"],
            "long_exhaustion": ["M&MFIN", "NYKAA"],
            "spinning_top": [],
            "engulfing": {"bullish": 0, "bearish": 0, "stocks": []},
            "longline": {
                "bullish": 17,
                "bearish": 67,
                "stocks": ["AUROPHARMA", "BANKBARODA", "BPCL", "CCL", "GESHIP", "IDBI", "INDGN", "ITI", "JINDALSAW", "JSL", "OLAELEC", "PFOCUS", "SHREECEM", "SONATSOFTW", "TITAN", "WELCORP", "ZENSARTECH"]
            }
        },
        "table": [
            {"RecordID": 1, "SYMBOL": "ADANIENT", "RECENT_VALUE": 2975.0, "SCORE": -7, "TIMEFRAME": "30Min", "LONGLINE": "BEARISH", "CONSECUTIVE_COUNT_GREEN": 0, "CONSECUTIVE_COUNT_RED": 2},
            {"RecordID": 2, "SYMBOL": "APOLLOHOSP", "RECENT_VALUE": 8912.0, "SCORE": -14, "TIMEFRAME": "30Min", "LONGLINE": "N", "CONSECUTIVE_COUNT_GREEN": 0, "CONSECUTIVE_COUNT_RED": 1},
            {"RecordID": 3, "SYMBOL": "ASIANPAINT", "RECENT_VALUE": 2440.3, "SCORE": -14, "TIMEFRAME": "30Min", "LONGLINE": "N", "CONSECUTIVE_COUNT_GREEN": 0, "CONSECUTIVE_COUNT_RED": 2},
            {"RecordID": 4, "SYMBOL": "BAJFINANCE", "RECENT_VALUE": 1021.3, "SCORE": -14, "TIMEFRAME": "30Min", "LONGLINE": "N", "CONSECUTIVE_COUNT_GREEN": 0, "CONSECUTIVE_COUNT_RED": 2},
            {"RecordID": 5, "SYMBOL": "BEL", "RECENT_VALUE": 398.5, "SCORE": -7, "TIMEFRAME": "30Min", "LONGLINE": "N", "CONSECUTIVE_COUNT_GREEN": 0, "CONSECUTIVE_COUNT_RED": 1},
            {"RecordID": 6, "SYMBOL": "HDFCLIFE", "RECENT_VALUE": 559.4, "SCORE": 13, "TIMEFRAME": "30Min", "LONGLINE": "BEARISH", "CONSECUTIVE_COUNT_GREEN": 0, "CONSECUTIVE_COUNT_RED": 1},
            {"RecordID": 7, "SYMBOL": "CIPLA", "RECENT_VALUE": 1386.1, "SCORE": -7, "TIMEFRAME": "30Min", "LONGLINE": "N", "CONSECUTIVE_COUNT_GREEN": 0, "CONSECUTIVE_COUNT_RED": 2},
            {"RecordID": 8, "SYMBOL": "DRREDDY", "RECENT_VALUE": 1198.3, "SCORE": 0, "TIMEFRAME": "30Min", "LONGLINE": "N", "CONSECUTIVE_COUNT_GREEN": 2, "CONSECUTIVE_COUNT_RED": 0},
            {"RecordID": 9, "SYMBOL": "EICHERMOT", "RECENT_VALUE": 7512.5, "SCORE": 6, "TIMEFRAME": "30Min", "LONGLINE": "N", "CONSECUTIVE_COUNT_GREEN": 0, "CONSECUTIVE_COUNT_RED": 1},
            {"RecordID": 10, "SYMBOL": "GRASIM", "RECENT_VALUE": 3166.0, "SCORE": -60, "TIMEFRAME": "30Min", "LONGLINE": "BEARISH", "CONSECUTIVE_COUNT_GREEN": 0, "CONSECUTIVE_COUNT_RED": 2}
        ]
    }

# 8. Exact Ichimoku Dashboard
def generate_ichimoku_data():
    return [
        {"RecordID": 1, "SYMBOL": "ADANIENT", "RECENT_VALUE": 2975.0, "TIMEFRAME": "1Week", "BULL_SCORE": 35, "BEAR_SCORE": 7, "Tenkan_Sen": 3022.0, "Kijun_Sen": 2499.0, "Senkou_Span_A": 2149.2, "Senkou_Span_B": 2230.4, "Chikou_Span": 2980.0},
        {"RecordID": 2, "SYMBOL": "ADANIENT", "RECENT_VALUE": 2975.0, "TIMEFRAME": "30Min", "BULL_SCORE": 7, "BEAR_SCORE": 14, "Tenkan_Sen": 2991.0, "Kijun_Sen": 2967.25, "Senkou_Span_A": 2935.7, "Senkou_Span_B": 3003.4, "Chikou_Span": 2975.0},
        {"RecordID": 3, "SYMBOL": "ADANIENT", "RECENT_VALUE": 2975.0, "TIMEFRAME": "60Min", "BULL_SCORE": 7, "BEAR_SCORE": 28, "Tenkan_Sen": 2980.0, "Kijun_Sen": 2961.45, "Senkou_Span_A": 3034.375, "Senkou_Span_B": 2986.25, "Chikou_Span": 2975.0},
        {"RecordID": 4, "SYMBOL": "ADANIENT", "RECENT_VALUE": 2975.0, "TIMEFRAME": "1Day", "BULL_SCORE": 7, "BEAR_SCORE": 28, "Tenkan_Sen": 3024.0, "Kijun_Sen": 3002.1, "Senkou_Span_A": 3044.2, "Senkou_Span_B": 3055.1, "Chikou_Span": 2975.0},
        {"RecordID": 5, "SYMBOL": "APOLLOHOSP", "RECENT_VALUE": 8912.0, "TIMEFRAME": "1Week", "BULL_SCORE": 77, "BEAR_SCORE": 7, "Tenkan_Sen": 8778.0, "Kijun_Sen": 8065.0, "Senkou_Span_A": 7340.75, "Senkou_Span_B": 7264.875, "Chikou_Span": 8840.0},
        {"RecordID": 6, "SYMBOL": "APOLLOHOSP", "RECENT_VALUE": 8912.0, "TIMEFRAME": "30Min", "BULL_SCORE": 28, "BEAR_SCORE": 7, "Tenkan_Sen": 8941.0, "Kijun_Sen": 8856.0, "Senkou_Span_A": 8753.375, "Senkou_Span_B": 8814.25, "Chikou_Span": 8920.0},
        {"RecordID": 7, "SYMBOL": "APOLLOHOSP", "RECENT_VALUE": 8912.0, "TIMEFRAME": "60Min", "BULL_SCORE": 42, "BEAR_SCORE": 0, "Tenkan_Sen": 8891.0, "Kijun_Sen": 8823.5, "Senkou_Span_A": 8884.125, "Senkou_Span_B": 8832.0, "Chikou_Span": 8920.0},
        {"RecordID": 8, "SYMBOL": "APOLLOHOSP", "RECENT_VALUE": 8912.0, "TIMEFRAME": "1Day", "BULL_SCORE": 84, "BEAR_SCORE": 0, "Tenkan_Sen": 8848.0, "Kijun_Sen": 8806.25, "Senkou_Span_A": 8778.75, "Senkou_Span_B": 8433.0, "Chikou_Span": 8920.0},
        {"RecordID": 9, "SYMBOL": "ASIANPAINT", "RECENT_VALUE": 2440.3, "TIMEFRAME": "1Week", "BULL_SCORE": 7, "BEAR_SCORE": 21, "Tenkan_Sen": 2630.0, "Kijun_Sen": 2489.5, "Senkou_Span_A": 2524.3, "Senkou_Span_B": 2574.15, "Chikou_Span": 2464.5},
        {"RecordID": 10, "SYMBOL": "ASIANPAINT", "RECENT_VALUE": 2440.3, "TIMEFRAME": "30Min", "BULL_SCORE": 21, "BEAR_SCORE": 28, "Tenkan_Sen": 2453.0, "Kijun_Sen": 2456.0, "Senkou_Span_A": 2428.9, "Senkou_Span_B": 2445.15, "Chikou_Span": 2450.0}
    ]

# 9. Exact Intraday Stock Trends (30-Min Timeline from 9:45 to 3:30)
def generate_stock_trends():
    results = []
    symbols = ["RELIANCE", "HDFCBANK", "ICICIBANK", "INFY", "TCS", "TATAMOTORS", "SBIN", "AXISBANK", "MARUTI"]
    for idx, sym in enumerate(symbols, start=1):
        st = market_sim.stocks.get(sym, {"ltp": 1000.0})
        is_bullish = st.get("chg", 0) >= 0
        trend_sample = ["GREEN" if is_bullish else "RED" for _ in range(13)]
        results.append({
            "RecordID": idx,
            "SYMBOL": sym,
            "LTP": st["ltp"],
            "CANDLE_1": trend_sample[0],   # 9:45
            "CANDLE_2": trend_sample[1],   # 10:15
            "CANDLE_3": trend_sample[2],   # 10:45
            "CANDLE_4": trend_sample[3],   # 11:15
            "CANDLE_5": trend_sample[4],   # 11:45
            "CANDLE_6": trend_sample[5],   # 12:15
            "CANDLE_7": trend_sample[6],   # 12:45
            "CANDLE_8": trend_sample[7],   # 1:15
            "CANDLE_9": trend_sample[8],   # 1:45
            "CANDLE_10": trend_sample[9],  # 2:15
            "CANDLE_11": trend_sample[10], # 2:45
            "CANDLE_12": trend_sample[11], # 3:15
            "CANDLE_13": trend_sample[12], # 3:30
        })
    return results

# 10. Exact Technical Indicators
def generate_technical_indicators():
    return [
        {"RecordID": 1, "SYMBOL": "ADANIENT", "RECENT_VALUE": 2975.0, "ADX": 28.4, "ATR": 47.8, "PDI": 24.1, "MDI": 21.6, "MACD": 14.5, "BB_UP": 3045.0, "BB_MID": 2975.0, "BB_LOW": 2905.0, "RSI": 56.2, "SLOWK": 62.4, "SLOWD": 58.1, "SIGNAL_DT": "2026-09-21"},
        {"RecordID": 2, "SYMBOL": "APOLLOHOSP", "RECENT_VALUE": 8912.0, "ADX": 34.2, "ATR": 112.5, "PDI": 29.3, "MDI": 16.4, "MACD": 68.2, "BB_UP": 9120.0, "BB_MID": 8912.0, "BB_LOW": 8704.0, "RSI": 68.4, "SLOWK": 74.1, "SLOWD": 70.8, "SIGNAL_DT": "2026-09-21"},
        {"RecordID": 3, "SYMBOL": "ASIANPAINT", "RECENT_VALUE": 2440.3, "ADX": 21.6, "ATR": 38.2, "PDI": 18.5, "MDI": 26.2, "MACD": -12.4, "BB_UP": 2510.0, "BB_MID": 2440.3, "BB_LOW": 2370.0, "RSI": 42.1, "SLOWK": 38.6, "SLOWD": 41.2, "SIGNAL_DT": "2026-09-21"},
        {"RecordID": 4, "SYMBOL": "BAJFINANCE", "RECENT_VALUE": 1021.3, "ADX": 19.8, "ATR": 18.4, "PDI": 19.1, "MDI": 24.8, "MACD": -5.6, "BB_UP": 1055.0, "BB_MID": 1021.3, "BB_LOW": 987.0, "RSI": 44.7, "SLOWK": 42.0, "SLOWD": 45.3, "SIGNAL_DT": "2026-09-21"},
        {"RecordID": 5, "SYMBOL": "BEL", "RECENT_VALUE": 398.5, "ADX": 31.0, "ATR": 7.2, "PDI": 27.4, "MDI": 18.2, "MACD": 4.1, "BB_UP": 412.0, "BB_MID": 398.5, "BB_LOW": 385.0, "RSI": 61.5, "SLOWK": 68.9, "SLOWD": 64.2, "SIGNAL_DT": "2026-09-21"},
        {"RecordID": 6, "SYMBOL": "HDFCLIFE", "RECENT_VALUE": 559.4, "ADX": 24.5, "ATR": 9.6, "PDI": 22.8, "MDI": 20.1, "MACD": 3.8, "BB_UP": 574.0, "BB_MID": 559.4, "BB_LOW": 544.8, "RSI": 54.8, "SLOWK": 58.2, "SLOWD": 56.0, "SIGNAL_DT": "2026-09-21"},
        {"RecordID": 7, "SYMBOL": "CIPLA", "RECENT_VALUE": 1386.1, "ADX": 22.1, "ATR": 21.4, "PDI": 21.0, "MDI": 23.4, "MACD": -2.1, "BB_UP": 1425.0, "BB_MID": 1386.1, "BB_LOW": 1347.0, "RSI": 48.3, "SLOWK": 46.5, "SLOWD": 49.0, "SIGNAL_DT": "2026-09-21"},
        {"RecordID": 8, "SYMBOL": "DRREDDY", "RECENT_VALUE": 1198.3, "ADX": 26.7, "ATR": 19.8, "PDI": 25.6, "MDI": 19.2, "MACD": 6.4, "BB_UP": 1235.0, "BB_MID": 1198.3, "BB_LOW": 1161.0, "RSI": 58.9, "SLOWK": 64.3, "SLOWD": 60.7, "SIGNAL_DT": "2026-09-21"},
        {"RecordID": 9, "SYMBOL": "EICHERMOT", "RECENT_VALUE": 7512.5, "ADX": 29.8, "ATR": 98.4, "PDI": 26.9, "MDI": 18.5, "MACD": 42.0, "BB_UP": 7720.0, "BB_MID": 7512.5, "BB_LOW": 7305.0, "RSI": 63.1, "SLOWK": 69.5, "SLOWD": 66.2, "SIGNAL_DT": "2026-09-21"},
        {"RecordID": 10, "SYMBOL": "GRASIM", "RECENT_VALUE": 3166.0, "ADX": 36.5, "ATR": 54.2, "PDI": 14.8, "MDI": 32.1, "MACD": -28.4, "BB_UP": 3290.0, "BB_MID": 3166.0, "BB_LOW": 3042.0, "RSI": 36.8, "SLOWK": 28.4, "SLOWD": 32.1, "SIGNAL_DT": "2026-09-21"}
    ]

# 11. Exact Investment Trades
def generate_investment_trades():
    return [
        {"RecordID": 1, "STRATEGY": "INVEST-1", "TIMEPLAY": "INVEST", "SYMBOL": "PAYTM ***", "RECENT_VALUE": 1810.0, "ALERT": "LONG", "SIGNAL_DT": "2026-09-11 15:10:18", "STATUS": "ACTIVE", "ENTRY": 1817.5, "T1": 1953.8, "T2": 2059.0, "T3": 2059.0, "SL": 1576.0, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00"},
        {"RecordID": 2, "STRATEGY": "INVEST-1", "TIMEPLAY": "INVEST", "SYMBOL": "PERSISTENT", "RECENT_VALUE": 5449.0, "ALERT": "LONG", "SIGNAL_DT": "2026-08-28 15:10:13", "STATUS": "ACTIVE", "ENTRY": 5872.5, "T1": 6312.9, "T2": 6753.4, "T3": 6997.3, "SL": 5122.6, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00"},
        {"RecordID": 3, "STRATEGY": "INVEST-1", "TIMEPLAY": "INVEST", "SYMBOL": "ETERNAL ***", "RECENT_VALUE": 335.9, "ALERT": "LONG", "SIGNAL_DT": "2026-08-21 15:10:10", "STATUS": "ACTIVE", "ENTRY": 327.8, "T1": 352.4, "T2": 377.0, "T3": 391.3, "SL": 285.5, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00"},
        {"RecordID": 4, "STRATEGY": "INVEST-1", "TIMEPLAY": "INVEST", "SYMBOL": "SHRIRAMFIN", "RECENT_VALUE": 1011.8, "ALERT": "LONG", "SIGNAL_DT": "2026-08-07 15:10:08", "STATUS": "ACTIVE", "ENTRY": 1113.0, "T1": 1196.5, "T2": 1258.7, "T3": 1258.7, "SL": 967.3, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00"},
        {"RecordID": 5, "STRATEGY": "INVEST-1", "TIMEPLAY": "INVEST", "SYMBOL": "MPHASIS ***", "RECENT_VALUE": 2296.2, "ALERT": "LONG", "SIGNAL_DT": "2026-08-07 15:10:08", "STATUS": "ACTIVE", "ENTRY": 2478.9, "T1": 2664.8, "T2": 2836.0, "T3": 2836.0, "SL": 2121.8, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00"},
        {"RecordID": 6, "STRATEGY": "INVEST-1", "TIMEPLAY": "INVEST", "SYMBOL": "M&M", "RECENT_VALUE": 3055.3, "ALERT": "LONG", "SIGNAL_DT": "2026-07-31 15:10:32", "STATUS": "ACTIVE", "ENTRY": 3401.1, "T1": 3656.2, "T2": 3911.3, "T3": 3937.1, "SL": 3043.8, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00"},
        {"RecordID": 7, "STRATEGY": "INVEST-1", "TIMEPLAY": "INVEST", "SYMBOL": "ETERNAL", "RECENT_VALUE": 335.9, "ALERT": "LONG", "SIGNAL_DT": "2026-07-31 15:10:32", "STATUS": "T1 MET", "ENTRY": 303.0, "T1": 325.7, "T2": 347.6, "T3": 347.6, "SL": 258.4, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "2026-08-20 09:49:00"},
        {"RecordID": 8, "STRATEGY": "INVEST-1", "TIMEPLAY": "INVEST", "SYMBOL": "BHARTIARTL ***", "RECENT_VALUE": 1830.2, "ALERT": "LONG", "SIGNAL_DT": "2026-07-31 15:10:32", "STATUS": "ACTIVE", "ENTRY": 1971.0, "T1": 2118.8, "T2": 2227.6, "T3": 2227.6, "SL": 1800.0, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00"},
        {"RecordID": 9, "STRATEGY": "INVEST-1", "TIMEPLAY": "INVEST", "SYMBOL": "BAJAJFINSV ***", "RECENT_VALUE": 1849.8, "ALERT": "LONG", "SIGNAL_DT": "2026-07-31 15:10:32", "STATUS": "ACTIVE", "ENTRY": 2021.0, "T1": 2172.6, "T2": 2220.2, "T3": 2220.2, "SL": 1821.8, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00"},
        {"RecordID": 10, "STRATEGY": "INVEST-1", "TIMEPLAY": "INVEST", "SYMBOL": "JIOFIN", "RECENT_VALUE": 229.97, "ALERT": "LONG", "SIGNAL_DT": "2026-07-31 15:10:32", "STATUS": "ACTIVE", "ENTRY": 256.9, "T1": 276.2, "T2": 295.4, "T3": 305.7, "SL": 222.0, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00"}
    ]

# 12. Index Trades
def generate_index_trades():
    market_sim.update_ticks()
    indices = [
        ("NIFTY 50", "INDEX BREAKOUT", "BUY", 24800, 24850, 24740, 24920, 25000, "24900 CE"),
        ("BANK NIFTY", "CPR PULLBACK", "BUY", 52100, 52180, 51950, 52350, 52500, "52200 CE"),
        ("FINNIFTY", "EXPIRY VOLATILITY", "SELL", 23450, 23410, 23550, 23320, 23200, "23400 PE"),
        ("SENSEX", "MOMENTUM SURGE", "BUY", 81400, 81450, 81200, 81700, 81950, "81500 CE")
    ]
    results = []
    for idx, (sym, strat, alert, entry, ltp, sl, t1, t2, opt) in enumerate(indices, start=1):
        st = market_sim.stocks.get(sym, {"ltp": ltp})
        actual_ltp = st["ltp"]
        results.append({
            "id": idx,
            "symbol": sym,
            "strategy": strat,
            "alert": alert,
            "entry": entry,
            "ltp": actual_ltp,
            "stoploss": sl,
            "target1": t1,
            "target2": t2,
            "suggested_option": opt,
            "status": "ACTIVE" if (alert == "BUY" and actual_ltp < t1) else "T1 HIT",
            "time": "09:30 AM"
        })
    return results

# 13. Multiday Trades
def generate_multiday_trades():
    return [
        {"RecordID": 1, "STRATEGY": "MOMENTUM-1", "TIMEPLAY": "MULTIDAY", "SYMBOL": "OFSS ***", "RECENT_VALUE": 10911.0, "ALERT": "SHORT", "SIGNAL_DT": "2026-09-21 15:04:26", "STATUS": "ACTIVE", "ENTRY": 10965.0, "T1": 10767.6, "T2": 10570.3, "T3": 9771.4, "SL": 11622.9, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00", "SUMMARY": [0, -1, 1, -1]},
        {"RecordID": 2, "STRATEGY": "MOMENTUM-1", "TIMEPLAY": "MULTIDAY", "SYMBOL": "INOXWIND ***", "RECENT_VALUE": 77.5, "ALERT": "LONG", "SIGNAL_DT": "2026-09-21 15:04:26", "STATUS": "ACTIVE", "ENTRY": 77.7, "T1": 79.1, "T2": 80.5, "T3": 84.6, "SL": 73.0, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00", "SUMMARY": [0, 1, 1, 0]},
        {"RecordID": 3, "STRATEGY": "MOMENTUM-1", "TIMEPLAY": "MULTIDAY", "SYMBOL": "SOLARINDS", "RECENT_VALUE": 19265.0, "ALERT": "SHORT", "SIGNAL_DT": "2026-09-16 15:04:36", "STATUS": "ACTIVE", "ENTRY": 18915.0, "T1": 18574.5, "T2": 18234.1, "T3": 17228.5, "SL": 20049.9, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00", "SUMMARY": [0, 0, 0, 0]},
        {"RecordID": 4, "STRATEGY": "MOMENTUM-1", "TIMEPLAY": "MULTIDAY", "SYMBOL": "GMRAIRPORT ***", "RECENT_VALUE": 98.7, "ALERT": "SHORT", "SIGNAL_DT": "2026-09-16 15:04:36", "STATUS": "SL MET", "ENTRY": 92.3, "T1": 90.6, "T2": 89.0, "T3": 84.7, "SL": 97.4, "TRADE": "CLOSED", "EXIT": 97.4, "UPDATE_DT": "2026-09-18 11:18:49", "SUMMARY": [-1, 0, 1, 0]},
        {"RecordID": 5, "STRATEGY": "MOMENTUM-1", "TIMEPLAY": "MULTIDAY", "SYMBOL": "NAM-INDIA ***", "RECENT_VALUE": 1146.7, "ALERT": "SHORT", "SIGNAL_DT": "2026-09-16 15:04:36", "STATUS": "ACTIVE", "ENTRY": 1113.2, "T1": 1093.2, "T2": 1073.1, "T3": 1008.1, "SL": 1180.0, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00", "SUMMARY": [0, 0, 0, 0]},
        {"RecordID": 6, "STRATEGY": "MOMENTUM-1", "TIMEPLAY": "MULTIDAY", "SYMBOL": "HINDZINC ***", "RECENT_VALUE": 591.8, "ALERT": "SHORT", "SIGNAL_DT": "2026-09-15 15:04:32", "STATUS": "ACTIVE", "ENTRY": 563.8, "T1": 553.6, "T2": 543.5, "T3": 526.9, "SL": 597.6, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00", "SUMMARY": [0, 0, 0, 0]},
        {"RecordID": 7, "STRATEGY": "MOMENTUM-1", "TIMEPLAY": "MULTIDAY", "SYMBOL": "VEDL ***", "RECENT_VALUE": 260.5, "ALERT": "SHORT", "SIGNAL_DT": "2026-09-15 15:04:32", "STATUS": "ACTIVE", "ENTRY": 254.7, "T1": 250.1, "T2": 245.5, "T3": 230.6, "SL": 270.0, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00", "SUMMARY": [0, 0, 0, -1]},
        {"RecordID": 8, "STRATEGY": "MOMENTUM-1", "TIMEPLAY": "MULTIDAY", "SYMBOL": "ZYDUSLIFE ***", "RECENT_VALUE": 1161.0, "ALERT": "SHORT", "SIGNAL_DT": "2026-09-15 15:04:32", "STATUS": "SL MET", "ENTRY": 1104.4, "T1": 1084.5, "T2": 1064.6, "T3": 1044.0, "SL": 1164.8, "TRADE": "CLOSED", "EXIT": 1164.8, "UPDATE_DT": "2026-09-18 09:33:41", "SUMMARY": [0, 0, 0, 0]},
        {"RecordID": 9, "STRATEGY": "MOMENTUM-1", "TIMEPLAY": "MULTIDAY", "SYMBOL": "SAIL ***", "RECENT_VALUE": 177.3, "ALERT": "SHORT", "SIGNAL_DT": "2026-09-15 15:04:32", "STATUS": "ACTIVE", "ENTRY": 173.5, "T1": 170.4, "T2": 167.2, "T3": 154.3, "SL": 183.9, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00", "SUMMARY": [0, 0, 0, 0]},
        {"RecordID": 10, "STRATEGY": "MOMENTUM-1", "TIMEPLAY": "MULTIDAY", "SYMBOL": "COFORGE ***", "RECENT_VALUE": 1814.0, "ALERT": "SHORT", "SIGNAL_DT": "2026-09-15 15:04:32", "STATUS": "T1 MET", "ENTRY": 1775.0, "T1": 1743.0, "T2": 1711.1, "T3": 1645.4, "SL": 1881.5, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "2026-09-16 09:48:45", "SUMMARY": [0, 0, 0, 0]}
    ]

# 14. Positional Trades
def generate_positional_trades():
    return [
        {"RecordID": 1, "STRATEGY": "MOMENTUM-1", "TIMEPLAY": "POSITIONAL", "SYMBOL": "GODREJPROP", "RECENT_VALUE": 1696.9, "ALERT": "SHORT", "SIGNAL_DT": "2026-09-18 15:09:57", "STATUS": "ACTIVE", "ENTRY": 1703.6, "T1": 1652.5, "T2": 1575.8, "T3": 1274.3, "SL": 1831.4, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00", "SUMMARY": [0, 0, 0, 0]},
        {"RecordID": 2, "STRATEGY": "MOMENTUM-1", "TIMEPLAY": "POSITIONAL", "SYMBOL": "PREMIERENE ***", "RECENT_VALUE": 919.9, "ALERT": "SHORT", "SIGNAL_DT": "2026-09-18 15:09:57", "STATUS": "ACTIVE", "ENTRY": 898.1, "T1": 871.2, "T2": 830.7, "T3": 691.6, "SL": 965.5, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00", "SUMMARY": [0, -1, 0, 0]},
        {"RecordID": 3, "STRATEGY": "SWING-1", "TIMEPLAY": "POSITIONAL", "SYMBOL": "GVT&D", "RECENT_VALUE": 4366.1, "ALERT": "LONG", "SIGNAL_DT": "2026-09-11 15:10:00", "STATUS": "SL MET", "ENTRY": 4509.2, "T1": 4644.5, "T2": 4847.4, "T3": 5418.7, "SL": 4238.6, "TRADE": "CLOSED", "EXIT": 4238.6, "UPDATE_DT": "2026-09-15 14:33:43", "SUMMARY": [0, 0, 0, 0]},
        {"RecordID": 4, "STRATEGY": "SWING-1", "TIMEPLAY": "POSITIONAL", "SYMBOL": "JUBLFOOD", "RECENT_VALUE": 487.05, "ALERT": "SHORT", "SIGNAL_DT": "2026-09-11 15:10:00", "STATUS": "SL MET", "ENTRY": 469.4, "T1": 455.3, "T2": 434.2, "T3": 366.3, "SL": 497.5, "TRADE": "CLOSED", "EXIT": 497.5, "UPDATE_DT": "2026-09-18 14:03:41", "SUMMARY": [0, 0, 1, 1]},
        {"RecordID": 5, "STRATEGY": "SWING-1", "TIMEPLAY": "POSITIONAL", "SYMBOL": "NAM-INDIA", "RECENT_VALUE": 1146.7, "ALERT": "LONG", "SIGNAL_DT": "2026-09-11 15:10:00", "STATUS": "SL MET", "ENTRY": 1182.5, "T1": 1218.0, "T2": 1271.2, "T3": 1410.4, "SL": 1111.6, "TRADE": "CLOSED", "EXIT": 1111.6, "UPDATE_DT": "2026-09-16 10:18:48", "SUMMARY": [0, 0, -1, -1]},
        {"RecordID": 6, "STRATEGY": "MOMENTUM-1", "TIMEPLAY": "POSITIONAL", "SYMBOL": "ASIANPAINT", "RECENT_VALUE": 2440.3, "ALERT": "SHORT", "SIGNAL_DT": "2026-09-11 15:09:58", "STATUS": "ACTIVE", "ENTRY": 2463.7, "T1": 2389.8, "T2": 2278.9, "T3": 2093.7, "SL": 2648.5, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00", "SUMMARY": [0, 0, -1, -1]},
        {"RecordID": 7, "STRATEGY": "MOMENTUM-1", "TIMEPLAY": "POSITIONAL", "SYMBOL": "WIPRO ***", "RECENT_VALUE": 164.55, "ALERT": "SHORT", "SIGNAL_DT": "2026-09-11 15:09:58", "STATUS": "ACTIVE", "ENTRY": 167.2, "T1": 162.2, "T2": 154.7, "T3": 133.2, "SL": 179.8, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00", "SUMMARY": [0, 0, 0, 0]},
        {"RecordID": 8, "STRATEGY": "MOMENTUM-1", "TIMEPLAY": "POSITIONAL", "SYMBOL": "MARUTI ***", "RECENT_VALUE": 12153.0, "ALERT": "SHORT", "SIGNAL_DT": "2026-09-11 15:09:58", "STATUS": "ACTIVE", "ENTRY": 12429.0, "T1": 12056.1, "T2": 11496.8, "T3": 10503.3, "SL": 13361.2, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00", "SUMMARY": [0, 0, 0, 0]},
        {"RecordID": 9, "STRATEGY": "MOMENTUM-1", "TIMEPLAY": "POSITIONAL", "SYMBOL": "SBILIFE", "RECENT_VALUE": 1756.0, "ALERT": "SHORT", "SIGNAL_DT": "2026-09-11 15:09:58", "STATUS": "ACTIVE", "ENTRY": 1692.4, "T1": 1641.6, "T2": 1565.5, "T3": 1409.9, "SL": 1819.3, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00", "SUMMARY": [0, 0, 0, 0]},
        {"RecordID": 10, "STRATEGY": "MOMENTUM-1", "TIMEPLAY": "POSITIONAL", "SYMBOL": "BRITANNIA", "RECENT_VALUE": 5023.0, "ALERT": "SHORT", "SIGNAL_DT": "2026-09-11 15:09:58", "STATUS": "ACTIVE", "ENTRY": 4990.0, "T1": 4840.3, "T2": 4615.8, "T3": 4229.7, "SL": 5364.2, "TRADE": "OPEN", "EXIT": 0, "UPDATE_DT": "0000-00-00 00:00:00", "SUMMARY": [0, 0, 0, -1]}
    ]

# 15. Turning Time
def generate_turning_times():
    cycles = [
        ("09:45 AM", "MORNING GAP DIGESTION TURN", "BULLISH TURN", "NIFTY & BANKNIFTY"),
        ("11:15 AM", "EUROPE PRE-OPEN SHIFT", "VOLATILITY INJECTION", "FNO HIGH BETA"),
        ("01:30 PM", "POST-LUNCH MOMENTUM RUN", "TREND ACCELERATION", "ALL SECTORS"),
        ("02:45 PM", "CLOSING EXPIRY PUSH", "POWER HOUR SURGE", "INDEX OPTIONS"),
    ]
    results = []
    for idx, (t, name, bias, scope) in enumerate(cycles, start=1):
        results.append({
            "id": idx,
            "time_window": t,
            "cycle_name": name,
            "expected_bias": bias,
            "impact_scope": scope,
            "countdown": "ACTIVE NOW" if idx == 2 else f"In {idx * 45} mins"
        })
    return results

# 16. Changed Now
def generate_changed_now():
    symbols = ["RELIANCE", "HDFCBANK", "TATAMOTORS", "INFY", "TCS", "SBIN", "MARUTI"]
    random.shuffle(symbols)
    results = []
    for sym in symbols[:4]:
        st = market_sim.stocks.get(sym, {"ltp": 1000.0})
        results.append({
            "symbol": sym,
            "ltp": st["ltp"],
            "event": "Crossed Above H4 Camarilla Level",
            "time": get_ist_now().strftime("%H:%M:%S"),
            "action": "FRESH BUY TRIGGERED"
        })
    return results

def get_market_trend_regime():
    nifty = market_sim.stocks.get("NIFTY 50", {})
    pct = nifty.get("chg_pct", 0.5)
    trend = "BULLISH" if pct > 0.2 else ("BEARISH" if pct < -0.2 else "SIDEWAYS")
    return [{
        "MARKET_TREND": trend,
        "NIFTY_PCT": pct,
        "VIX": market_sim.stocks.get("INDIA VIX", {}).get("ltp", 13.5),
        "TIMESTAMP": get_ist_now().strftime("%Y-%m-%d %H:%M:%S")
    }]

def generate_active_stocks():
    market_sim.update_ticks()
    now_ts = get_ist_now().strftime("%Y-%m-%d %H:%M:%S")
    
    bull_items = [
        {"SYMBOL": "HDFCLIFE", "SCORE": 3, "SCORE_OLD": 2, "PCT_CHG": 2.45, "BULL_BEAR": 1, "ASTRIKE_COUNT": 3, "CHANGE_COLOUR": 0, "TRENDED_FLIP": 1, "bull_t1": 685.0, "bull_t2": 698.0, "bull_sl": 662.0},
        {"SYMBOL": "MFSL", "SCORE": 3, "SCORE_OLD": 1, "PCT_CHG": 3.12, "BULL_BEAR": 1, "ASTRIKE_COUNT": 3, "CHANGE_COLOUR": 0, "TRENDED_FLIP": 1, "bull_t1": 1045.0, "bull_t2": 1068.0, "bull_sl": 1010.0},
        {"SYMBOL": "HCLTECH", "SCORE": 2, "SCORE_OLD": 1, "PCT_CHG": 1.84, "BULL_BEAR": 1, "ASTRIKE_COUNT": 2, "CHANGE_COLOUR": 0, "TRENDED_FLIP": 1, "bull_t1": 1780.0, "bull_t2": 1810.0, "bull_sl": 1735.0},
        {"SYMBOL": "RELIANCE", "SCORE": 3, "SCORE_OLD": 2, "PCT_CHG": 1.25, "BULL_BEAR": 1, "ASTRIKE_COUNT": 3, "CHANGE_COLOUR": 0, "TRENDED_FLIP": 1, "bull_t1": 3050.0, "bull_t2": 3090.0, "bull_sl": 2960.0},
        {"SYMBOL": "TATAMOTORS", "SCORE": 4, "SCORE_OLD": 3, "PCT_CHG": 2.15, "BULL_BEAR": 1, "ASTRIKE_COUNT": 3, "CHANGE_COLOUR": 0, "TRENDED_FLIP": 1, "bull_t1": 995.0, "bull_t2": 1020.0, "bull_sl": 955.0},
        {"SYMBOL": "TCS", "SCORE": 2, "SCORE_OLD": 1, "PCT_CHG": 0.95, "BULL_BEAR": 1, "ASTRIKE_COUNT": 2, "CHANGE_COLOUR": 0, "TRENDED_FLIP": 1, "bull_t1": 3980.0, "bull_t2": 4025.0, "bull_sl": 3910.0},
        {"SYMBOL": "SBIN", "SCORE": 2, "SCORE_OLD": 0, "PCT_CHG": 1.10, "BULL_BEAR": 1, "ASTRIKE_COUNT": 1, "CHANGE_COLOUR": 0, "TRENDED_FLIP": 1, "bull_t1": 825.0, "bull_t2": 838.0, "bull_sl": 802.0},
        {"SYMBOL": "ICICIBANK", "SCORE": 3, "SCORE_OLD": 2, "PCT_CHG": 1.45, "BULL_BEAR": 1, "ASTRIKE_COUNT": 3, "CHANGE_COLOUR": 0, "TRENDED_FLIP": 1, "bull_t1": 1235.0, "bull_t2": 1255.0, "bull_sl": 1195.0},
    ]

    bear_items = [
        {"SYMBOL": "INFY", "SCORE": -3, "SCORE_OLD": -2, "PCT_CHG": -1.85, "BULL_BEAR": -1, "ASTRIKE_COUNT": 3, "CHANGE_COLOUR": 0, "TRENDED_FLIP": 1, "bear_t1": 1640.0, "bear_t2": 1615.0, "bear_sl": 1690.0},
        {"SYMBOL": "AXISBANK", "SCORE": -2, "SCORE_OLD": -1, "PCT_CHG": -1.15, "BULL_BEAR": -1, "ASTRIKE_COUNT": 2, "CHANGE_COLOUR": 0, "TRENDED_FLIP": 1, "bear_t1": 1165.0, "bear_t2": 1148.0, "bear_sl": 1195.0},
        {"SYMBOL": "TATASTEEL", "SCORE": -2, "SCORE_OLD": 0, "PCT_CHG": -0.92, "BULL_BEAR": -1, "ASTRIKE_COUNT": 2, "CHANGE_COLOUR": 0, "TRENDED_FLIP": 1, "bear_t1": 153.0, "bear_t2": 150.5, "bear_sl": 158.0},
        {"SYMBOL": "WIPRO", "SCORE": -1, "SCORE_OLD": 0, "PCT_CHG": -0.65, "BULL_BEAR": -1, "ASTRIKE_COUNT": 1, "CHANGE_COLOUR": 0, "TRENDED_FLIP": 1, "bear_t1": 535.0, "bear_t2": 526.0, "bear_sl": 548.0},
    ]

    tg_bull_items = [
        {"SYMBOL": "MARUTI", "SCORE": 1, "SCORE_OLD": 0, "PCT_CHG": 0.85, "BULL_BEAR": 1, "ASTRIKE_COUNT": 1, "CHANGE_COLOUR": 0, "REVERSAL_FLIP": 1, "bull_t1": 12550.0, "bull_t2": 12700.0, "bull_sl": 12300.0},
        {"SYMBOL": "SUNPHARMA", "SCORE": 1, "SCORE_OLD": -1, "PCT_CHG": 0.72, "BULL_BEAR": 1, "ASTRIKE_COUNT": 1, "CHANGE_COLOUR": 0, "REVERSAL_FLIP": 1, "bull_t1": 1755.0, "bull_t2": 1775.0, "bull_sl": 1720.0},
        {"SYMBOL": "LT", "SCORE": 1, "SCORE_OLD": 0, "PCT_CHG": 0.90, "BULL_BEAR": 1, "ASTRIKE_COUNT": 1, "CHANGE_COLOUR": 0, "REVERSAL_FLIP": 1, "bull_t1": 3650.0, "bull_t2": 3700.0, "bull_sl": 3570.0},
    ]

    tg_bear_items = [
        {"SYMBOL": "BAJFINANCE", "SCORE": -1, "SCORE_OLD": 0, "PCT_CHG": -0.75, "BULL_BEAR": -1, "ASTRIKE_COUNT": 1, "CHANGE_COLOUR": 0, "REVERSAL_FLIP": 1, "bear_t1": 7150.0, "bear_t2": 7050.0, "bear_sl": 7320.0},
        {"SYMBOL": "ASIANPAINT", "SCORE": -1, "SCORE_OLD": 1, "PCT_CHG": -0.82, "BULL_BEAR": -1, "ASTRIKE_COUNT": 1, "CHANGE_COLOUR": 0, "REVERSAL_FLIP": 1, "bear_t1": 3130.0, "bear_t2": 3080.0, "bear_sl": 3210.0},
    ]

    pg_looser_items = [
        {"SYMBOL": "TRENT", "SCORE": 5, "SCORE_OLD": 4, "PCT_CHG": 4.85, "BULL_BEAR": 1, "ASTRIKE_COUNT": 4, "CHANGE_COLOUR": 0, "TRENDED_FLIP": 1, "bull_t1": 7150.0, "bull_t2": 7320.0, "bull_sl": 6850.0},
        {"SYMBOL": "DIXON", "SCORE": 4, "SCORE_OLD": 3, "PCT_CHG": 3.92, "BULL_BEAR": 1, "ASTRIKE_COUNT": 3, "CHANGE_COLOUR": 0, "TRENDED_FLIP": 1, "bull_t1": 12800.0, "bull_t2": 13100.0, "bull_sl": 12400.0},
        {"SYMBOL": "HDFCLIFE", "SCORE": 3, "SCORE_OLD": 2, "PCT_CHG": 2.45, "BULL_BEAR": 1, "ASTRIKE_COUNT": 3, "CHANGE_COLOUR": 0, "TRENDED_FLIP": 1, "bull_t1": 685.0, "bull_t2": 698.0, "bull_sl": 662.0},
        {"SYMBOL": "MFSL", "SCORE": 3, "SCORE_OLD": 1, "PCT_CHG": 3.12, "BULL_BEAR": 1, "ASTRIKE_COUNT": 3, "CHANGE_COLOUR": 0, "TRENDED_FLIP": 1, "bull_t1": 1045.0, "bull_t2": 1068.0, "bull_sl": 1010.0},
        {"SYMBOL": "TATAMOTORS", "SCORE": 4, "SCORE_OLD": 3, "PCT_CHG": 2.15, "BULL_BEAR": 1, "ASTRIKE_COUNT": 3, "CHANGE_COLOUR": 0, "TRENDED_FLIP": 1, "bull_t1": 995.0, "bull_t2": 1020.0, "bull_sl": 955.0},
        {"SYMBOL": "INFY", "SCORE": -3, "SCORE_OLD": -2, "PCT_CHG": -1.85, "BULL_BEAR": -1, "ASTRIKE_COUNT": 3, "CHANGE_COLOUR": 0, "TRENDED_FLIP": 1, "bear_t1": 1640.0, "bear_t2": 1615.0, "bear_sl": 1690.0},
        {"SYMBOL": "AXISBANK", "SCORE": -2, "SCORE_OLD": -1, "PCT_CHG": -1.15, "BULL_BEAR": -1, "ASTRIKE_COUNT": 2, "CHANGE_COLOUR": 0, "TRENDED_FLIP": 1, "bear_t1": 1165.0, "bear_t2": 1148.0, "bear_sl": 1195.0},
    ]

    for item in bull_items + bear_items + tg_bull_items + tg_bear_items + pg_looser_items:
        item["TRADE_RANGE_TS"] = now_ts
        st = market_sim.stocks.get(item["SYMBOL"])
        if st:
            item["LTP"] = st["ltp"]

    return {
        "trended_bullish": bull_items,
        "trended_bearish": bear_items,
        "reversal_bullish": tg_bull_items,
        "reversal_bearish": tg_bear_items,
        "price_gainer_looser": pg_looser_items
    }

def generate_fibonacci_heatmap():
    market_sim.update_ticks()
    return {
        "bearish_to_bullish": [
            {"sym": "ASIANPAINT", "dots": [1, 1, 1]}, {"sym": "BEL", "dots": [1, 1, 1]},
            {"sym": "EICHERMOT", "dots": [1, 1, 1]}, {"sym": "KOTAKBANK", "dots": [1, 1, 1]},
            {"sym": "ONGC", "dots": [1, 1, 1]}, {"sym": "RELIANCE", "dots": [1, 1, 1]},
            {"sym": "SBIN", "dots": [1, 1, 1]}, {"sym": "SUNPHARMA", "dots": [1, 1, 1]},
            {"sym": "TATACONSUM", "dots": [1, 1, 1]}, {"sym": "TITAN", "dots": [1, 1, 1]},
            {"sym": "SHRIRAMFIN", "dots": [1, 1, 1]}, {"sym": "INDIGO", "dots": [1, 1, 1]},
            {"sym": "LT", "dots": [1, 1, 1]}, {"sym": "ULTRACEMCO", "dots": [1, 1, 1]},
            {"sym": "JSWSTEEL", "dots": [1, 1, 1]}, {"sym": "NESTLEIND", "dots": [1, 1, 1]},
            {"sym": "JIOFIN", "dots": [1, 1, 1]}, {"sym": "ABB", "dots": [1, 1, 1]},
            {"sym": "BRITANNIA", "dots": [1, 1, 1]}, {"sym": "CGPOWER", "dots": [1, 1, 1]}
        ],
        "bearish_to_bullish_total": 67,
        "bearish_to_bullish_monthly": 7,
        "bullish_to_bearish": [
            {"sym": "BAJFINANCE", "dots": [-1, -1, -1]}, {"sym": "TMPV", "dots": [-1, -1, -1]},
            {"sym": "TATASTEEL", "dots": [-1, -1, -1]}, {"sym": "BHARTIARTL", "dots": [-1, -1, -1]},
            {"sym": "TATAPOWER", "dots": [-1, -1, -1]}, {"sym": "GODREJCP", "dots": [-1, -1, -1]},
            {"sym": "HYUNDAI", "dots": [-1, -1, -1]}, {"sym": "CONCOR", "dots": [-1, -1, -1]},
            {"sym": "OFSS", "dots": [-1, -1, -1]}, {"sym": "UPL", "dots": [-1, -1, -1]},
            {"sym": "NHPC", "dots": [-1, -1, -1]}, {"sym": "JUBLFOOD", "dots": [-1, -1, -1]},
            {"sym": "AUBANK", "dots": [-1, -1, -1]}, {"sym": "KFINTECH", "dots": [-1, -1, -1]},
            {"sym": "RBLBANK", "dots": [-1, -1, -1]}, {"sym": "ATHERENERG", "dots": [-1, -1, -1]}
        ],
        "bullish_to_bearish_total": 16,
        "bullish_to_bearish_monthly": 11,
        "r4_plus": [
            {"sym": "ETERNAL", "dots": [1, 1, 1]}, {"sym": "LICHSGFIN", "dots": [1, 1, 1]},
            {"sym": "MANKIND", "dots": [1, 1, 1]}, {"sym": "PATANJALI", "dots": [1, 1, 1]},
            {"sym": "LAURUSLABS", "dots": [1, 1, 1]}
        ],
        "r4_plus_total": 5,
        "r3_r4": [
            {"sym": "HCLTECH", "dots": [1, 1, 1]}, {"sym": "TORNTPHARM", "dots": [1, 1, 1]},
            {"sym": "PNB", "dots": [1, 1, 1]}, {"sym": "SOLARINDS", "dots": [1, 1, 1]},
            {"sym": "DLF", "dots": [1, 1, 1]}, {"sym": "DMART", "dots": [1, 1, 1]},
            {"sym": "HEROMOTOCO", "dots": [1, 1, 1]}, {"sym": "BIOCON", "dots": [1, 1, 1]},
            {"sym": "NAUKRI", "dots": [1, 1, 1]}, {"sym": "ICICIGI", "dots": [1, 1, -1]},
            {"sym": "SENSEX", "dots": [1, 1, -1]}
        ],
        "r3_r4_total": 11,
        "r2_r3": [
            {"sym": "HDFCBANK", "dots": [1, 1, 1]}, {"sym": "ITC", "dots": [1, 1, 1]},
            {"sym": "ONGC", "dots": [1, 1, -1]}, {"sym": "RELIANCE", "dots": [1, 1, -1]},
            {"sym": "TITAN", "dots": [1, -1, 1]}, {"sym": "MAXHEALTH", "dots": [1, 1, 1]},
            {"sym": "INDHOTEL", "dots": [1, 1, 1]}, {"sym": "UNITDSPR", "dots": [1, -1, 1]},
            {"sym": "VOLTAS", "dots": [1, 1, 1]}, {"sym": "MARICO", "dots": [1, 1, 1]},
            {"sym": "NYKAA", "dots": [1, 1, 1]}, {"sym": "LUPIN", "dots": [1, 1, 1]},
            {"sym": "PHOENIXLTD", "dots": [1, 1, 1]}, {"sym": "OBEROIRLTY", "dots": [1, 1, 1]},
            {"sym": "PRESTIGE", "dots": [1, 1, 1]}, {"sym": "DIXON", "dots": [1, 1, 1]},
            {"sym": "INOXWIND", "dots": [1, 1, 1]}, {"sym": "DELHIVERY", "dots": [1, 1, 1]},
            {"sym": "KAYNES", "dots": [1, 1, 1]}, {"sym": "NIFTY", "dots": [1, 1, -1]}
        ],
        "r2_r3_total": 20,
        "r1_r2": [
            {"sym": "BEL", "dots": [1, 1, 1]}, {"sym": "DRREDDY", "dots": [1, 1, 1]},
            {"sym": "SUNPHARMA", "dots": [1, 1, 1]}, {"sym": "ULTRACEMCO", "dots": [1, 1, 1]},
            {"sym": "BAJAJ-AUTO", "dots": [1, 1, 1]}, {"sym": "NESTLEIND", "dots": [1, 1, 1]},
            {"sym": "SBILIFE", "dots": [1, 1, 1]}, {"sym": "BAJAJHLDNG", "dots": [1, 1, 1]},
            {"sym": "BRITANNIA", "dots": [1, 1, 1]}, {"sym": "CGPOWER", "dots": [1, 1, 1]},
            {"sym": "HDFCAMC", "dots": [1, 1, 1]}, {"sym": "JINDALSTEL", "dots": [1, 1, 1]},
            {"sym": "ZYDUSLIFE", "dots": [1, 1, 1]}, {"sym": "VBL", "dots": [1, 1, 1]},
            {"sym": "MUTHOOTFIN", "dots": [1, 1, 1]}, {"sym": "SRF", "dots": [1, 1, 1]},
            {"sym": "POLICYBZR", "dots": [1, 1, 1]}, {"sym": "GLENMARK", "dots": [1, 1, 1]},
            {"sym": "BLUESTARCO", "dots": [1, 1, 1]}, {"sym": "PREMIERENE", "dots": [1, 1, 1]}
        ],
        "r1_r2_total": 24,
        "p_r1": [
            {"sym": "APOLLOHOSP", "dots": [1, 1, 1]}, {"sym": "HDFCLIFE", "dots": [1, 1, 1]},
            {"sym": "HINDUNILVR", "dots": [1, 1, -1]}, {"sym": "KOTAKBANK", "dots": [1, 1, 1]},
            {"sym": "TRENT", "dots": [1, 1, 1]}, {"sym": "SBIN", "dots": [1, 1, -1]},
            {"sym": "TATACONSUM", "dots": [1, 1, 1]}, {"sym": "SHRIRAMFIN", "dots": [1, 1, -1]},
            {"sym": "INDIGO", "dots": [1, 1, 1]}, {"sym": "LT", "dots": [1, 1, -1]},
            {"sym": "TCS", "dots": [1, 1, 1]}, {"sym": "NTPC", "dots": [1, 1, 1]},
            {"sym": "TECHM", "dots": [1, 1, -1]}, {"sym": "COALINDIA", "dots": [1, 1, 1]},
            {"sym": "ABB", "dots": [1, 1, -1]}, {"sym": "BPCL", "dots": [1, 1, 1]},
            {"sym": "AMBUJACEM", "dots": [1, 1, 1]}, {"sym": "HINDZINC", "dots": [1, 1, 1]},
            {"sym": "IOC", "dots": [1, 1, 1]}, {"sym": "CUMMINSIND", "dots": [1, 1, 1]}
        ],
        "p_r1_total": 58,
        "s4_minus": [
            {"sym": "OFSS", "dots": [-1, -1, -1]}, {"sym": "BSE", "dots": [-1, -1, -1]}
        ],
        "s4_minus_total": 2,
        "s3_s4": [
            {"sym": "TATASTEEL", "dots": [-1, -1, -1]}
        ],
        "s3_s4_total": 1,
        "s2_s3": [
            {"sym": "GRASIM", "dots": [-1, -1, -1]}, {"sym": "BHARTIARTL", "dots": [-1, -1, -1]},
            {"sym": "GODREJCP", "dots": [-1, -1, -1]}, {"sym": "HYUNDAI", "dots": [-1, -1, -1]},
            {"sym": "MCX", "dots": [-1, -1, -1]}, {"sym": "RBLBANK", "dots": [-1, 1, -1]}
        ],
        "s2_s3_total": 6,
        "s1_s2": [
            {"sym": "BAJFINANCE", "dots": [-1, -1, -1]}, {"sym": "HINDALCO", "dots": [-1, -1, -1]},
            {"sym": "INFY", "dots": [-1, -1, -1]}, {"sym": "TMPV", "dots": [-1, -1, -1]},
            {"sym": "CHOLAFIN", "dots": [-1, -1, -1]}, {"sym": "VEDL", "dots": [-1, -1, -1]},
            {"sym": "SAIL", "dots": [-1, -1, -1]}, {"sym": "BANKINDIA", "dots": [-1, -1, -1]},
            {"sym": "CONCOR", "dots": [-1, -1, -1]}, {"sym": "IDFCFIRSTB", "dots": [-1, -1, -1]},
            {"sym": "IDEA", "dots": [-1, -1, -1]}, {"sym": "ASTRAL", "dots": [-1, -1, -1]},
            {"sym": "SBICARD", "dots": [-1, -1, -1]}, {"sym": "AUBANK", "dots": [-1, -1, -1]},
            {"sym": "WAAREEENER", "dots": [-1, -1, -1]}, {"sym": "SWIGGY", "dots": [-1, -1, -1]},
            {"sym": "CAMS", "dots": [-1, -1, -1]}, {"sym": "LICI", "dots": [-1, -1, -1]},
            {"sym": "KFINTECH", "dots": [-1, -1, -1]}, {"sym": "CROMPTON", "dots": [-1, -1, -1]}
        ],
        "s1_s2_total": 20,
        "p_s1": [
            {"sym": "ADANIENT", "dots": [-1, -1, -1]}, {"sym": "ASIANPAINT", "dots": [-1, -1, -1]},
            {"sym": "CIPLA", "dots": [-1, -1, -1]}, {"sym": "EICHERMOT", "dots": [-1, -1, -1]},
            {"sym": "M&M", "dots": [-1, -1, -1]}, {"sym": "WIPRO", "dots": [-1, -1, -1]},
            {"sym": "ICICIBANK", "dots": [-1, -1, -1]}, {"sym": "AXISBANK", "dots": [-1, -1, -1]},
            {"sym": "MARUTI", "dots": [-1, -1, -1]}, {"sym": "JSWSTEEL", "dots": [-1, -1, -1]},
            {"sym": "POWERGRID", "dots": [-1, -1, -1]}, {"sym": "ADANIPORTS", "dots": [-1, 1, -1]},
            {"sym": "BAJAJFINSV", "dots": [-1, -1, -1]}, {"sym": "JIOFIN", "dots": [-1, -1, -1]},
            {"sym": "MAZDOCK", "dots": [-1, -1, -1]}, {"sym": "IRFC", "dots": [-1, -1, -1]},
            {"sym": "SHREECEM", "dots": [-1, -1, -1]}, {"sym": "TATAPOWER", "dots": [-1, -1, -1]},
            {"sym": "ADANIGREEN", "dots": [-1, -1, -1]}, {"sym": "MOTHERSON", "dots": [-1, -1, -1]}
        ],
        "p_s1_total": 68
    }

def generate_camarilla_heatmap():
    market_sim.update_ticks()
    return {
        "above_h6": [
            {"sym": "PATANJALI", "score": 16, "dots": [1, 1, 1]},
            {"sym": "MANKIND", "score": 16, "dots": [1, 1, 1]},
            {"sym": "LAURUSLABS", "score": 15, "dots": [1, 1, 1]},
            {"sym": "NAUKRI", "score": 13, "dots": [1, 1, 1]},
            {"sym": "LICHSGFIN", "score": 12, "dots": [1, 1, 1]},
            {"sym": "ICICIGI", "score": 8, "dots": [1, 1, 1]},
            {"sym": "ETERNAL", "score": 8, "dots": [1, 1, 1]},
            {"sym": "HEROMOTOCO", "score": 8, "dots": [1, 1, 1]}
        ],
        "above_h6_total": 8,
        "above_h4": [
            {"sym": "PATANJALI", "score": 16, "dots": [1, 1, 1]},
            {"sym": "MANKIND", "score": 16, "dots": [1, 1, 1]},
            {"sym": "LAURUSLABS", "score": 15, "dots": [1, 1, 1]},
            {"sym": "NAUKRI", "score": 13, "dots": [1, 1, 1]},
            {"sym": "LICHSGFIN", "score": 12, "dots": [1, 1, 1]},
            {"sym": "SENSEX", "score": 11, "dots": [1, 1, 1]},
            {"sym": "DLF", "score": 10, "dots": [1, 1, 1]},
            {"sym": "LUPIN", "score": 10, "dots": [1, 1, 1]},
            {"sym": "SOLARINDS", "score": 9, "dots": [1, 1, 1]},
            {"sym": "TORNTPHARM", "score": 9, "dots": [1, 1, 1]},
            {"sym": "ITC", "score": 9, "dots": [1, 1, 1]},
            {"sym": "ONGC", "score": 9, "dots": [1, 1, 1]},
            {"sym": "ICICIGI", "score": 8, "dots": [1, 1, 1]},
            {"sym": "HCLTECH", "score": 8, "dots": [1, 1, 1]},
            {"sym": "ETERNAL", "score": 8, "dots": [1, 1, 1]},
            {"sym": "PRESTIGE", "score": 8, "dots": [1, 1, 1]},
            {"sym": "HEROMOTOCO", "score": 8, "dots": [1, 1, 1]},
            {"sym": "DIXON", "score": 8, "dots": [1, 1, -1]},
            {"sym": "DRREDDY", "score": 8, "dots": [1, 1, 1]},
            {"sym": "UNITDSPR", "score": 7, "dots": [1, 1, -1]}
        ],
        "above_h4_total": 51,
        "above_h3": [
            {"sym": "NYKAA", "dots": [1, 1, 1]}, {"sym": "INOXWIND", "dots": [1, 1, 1]},
            {"sym": "TECHM", "dots": [1, 1, -1]}, {"sym": "TCS", "dots": [1, 1, -1]},
            {"sym": "NESTLEIND", "dots": [1, 1, 1]}, {"sym": "HDFCBANK", "dots": [1, 1, 1]},
            {"sym": "BAJAJHLDNG", "dots": [1, 1, 1]}, {"sym": "PREMIERENE", "dots": [1, 1, 1]},
            {"sym": "MUTHOOTFIN", "dots": [1, 1, 1]}, {"sym": "ULTRACEMCO", "dots": [1, 1, 1]},
            {"sym": "COALINDIA", "dots": [1, 1, 1]}, {"sym": "VBL", "dots": [1, 1, 1]},
            {"sym": "PERSISTENT", "dots": [1, 1, 1]}, {"sym": "OIL", "dots": [1, 1, 1]},
            {"sym": "ZYDUSLIFE", "dots": [1, 1, 1]}, {"sym": "INDUSTOWER", "dots": [1, 1, 1]},
            {"sym": "BRITANNIA", "dots": [1, 1, 1]}, {"sym": "NTPC", "dots": [1, 1, 1]},
            {"sym": "AMBUJACEM", "dots": [1, 1, 1]}, {"sym": "BOSCHLTD", "dots": [1, 1, 1]}
        ],
        "above_h3_total": 29,
        "open_above_h3": [
            {"sym": "PREMIERENE", "dots": [1, 1, 1]}
        ],
        "open_above_h3_total": 1,
        "open_above_h4": [],
        "open_above_h4_total": 0,
        "h3_l3_rejection": [
            {"sym": "KALYANKJIL", "is_bull": True, "dots": [1, 1, 1]},
            {"sym": "SAGILITY", "is_bull": False, "dots": [-1, -1, -1]},
            {"sym": "M&M", "is_bull": False, "dots": [-1, -1, -1]}
        ],
        "h3_l3_rejection_total": 3,
        "h4_l4_rejection": [
            {"sym": "INDUSTOWER", "is_bull": False, "dots": [-1, -1, -1]}
        ],
        "h4_l4_rejection_total": 1,
        "below_l6": [
            {"sym": "BSE", "score": 15, "dots": [-1, -1, -1]},
            {"sym": "OFSS", "score": 13, "dots": [-1, -1, -1]}
        ],
        "below_l6_total": 2,
        "below_l4": [
            {"sym": "BSE", "score": 15, "dots": [-1, -1, -1]},
            {"sym": "KFINTECH", "score": 14, "dots": [-1, -1, -1]},
            {"sym": "OFSS", "score": 13, "dots": [-1, -1, -1]},
            {"sym": "GRASIM", "score": 13, "dots": [-1, -1, -1]},
            {"sym": "CHOLAFIN", "score": 11, "dots": [-1, -1, -1]},
            {"sym": "RBLBANK", "score": 11, "dots": [-1, 1, -1]},
            {"sym": "BHARTIARTL", "score": 10, "dots": [-1, -1, -1]},
            {"sym": "UPL", "score": 9, "dots": [-1, -1, -1]},
            {"sym": "HYUNDAI", "score": 8, "dots": [-1, -1, -1]},
            {"sym": "WAAREEENER", "score": 7, "dots": [-1, -1, -1]},
            {"sym": "VEDL", "score": 7, "dots": [-1, -1, -1]},
            {"sym": "CONCOR", "score": 6, "dots": [-1, -1, -1]},
            {"sym": "SBICARD", "score": 6, "dots": [-1, -1, -1]},
            {"sym": "IREDA", "score": 5, "dots": [-1, -1, -1]},
            {"sym": "GODREJCP", "score": 5, "dots": [-1, -1, -1]},
            {"sym": "MCX", "score": 5, "dots": [-1, -1, -1]},
            {"sym": "BAJFINANCE", "score": 4, "dots": [-1, -1, -1]},
            {"sym": "TATASTEEL", "score": 4, "dots": [-1, -1, -1]},
            {"sym": "CDSL", "score": 3, "dots": [-1, -1, -1]},
            {"sym": "ASTRAL", "score": 3, "dots": [-1, -1, -1]}
        ],
        "below_l4_total": 42,
        "below_l3": [
            {"sym": "ADANIGREEN", "dots": [-1, -1, -1]}, {"sym": "RVNL", "dots": [-1, -1, -1]},
            {"sym": "SONACOMS", "dots": [-1, -1, -1]}, {"sym": "ATHERENERG", "dots": [-1, -1, -1]},
            {"sym": "MANAPPURAM", "dots": [-1, -1, -1]}, {"sym": "LTF", "dots": [-1, -1, -1]},
            {"sym": "ANGELONE", "dots": [-1, -1, -1]}, {"sym": "JSWSTEEL", "dots": [-1, -1, -1]},
            {"sym": "GODFRYPHLP", "dots": [-1, -1, -1]}, {"sym": "ASHOKLEY", "dots": [-1, -1, -1]},
            {"sym": "NAM-INDIA", "dots": [-1, -1, -1]}, {"sym": "TMPV", "dots": [-1, -1, -1]},
            {"sym": "PAYTM", "dots": [-1, -1, -1]}, {"sym": "ADANIENT", "dots": [-1, -1, -1]},
            {"sym": "POWERGRID", "dots": [-1, -1, -1]}, {"sym": "HINDALCO", "dots": [-1, -1, -1]},
            {"sym": "RECLTD", "dots": [-1, -1, -1]}, {"sym": "GAIL", "dots": [-1, -1, -1]},
            {"sym": "KEI", "dots": [-1, -1, -1]}, {"sym": "HAVELLS", "dots": [-1, -1, -1]}
        ],
        "below_l3_total": 34,
        "open_below_l3": [
            {"sym": "POWERGRID", "dots": [-1, -1, -1]}, {"sym": "INDUSINDBK", "dots": [-1, -1, -1]},
            {"sym": "HAVELLS", "dots": [-1, -1, -1]}, {"sym": "WIPRO", "dots": [-1, -1, -1]}
        ],
        "open_below_l3_total": 4,
        "open_below_l4": [],
        "open_below_l4_total": 0,
        "h3_l3_breakout": [
            {"sym": "ASHOKLEY", "is_bull": False, "dots": [-1, -1, -1]},
            {"sym": "SAIL", "is_bull": False, "dots": [-1, -1, -1]}
        ],
        "h3_l3_breakout_total": 2,
        "h4_l4_breakout": [
            {"sym": "MAZDOCK", "is_bull": False, "dots": [-1, -1, -1]}
        ],
        "h4_l4_breakout_total": 1
    }

def generate_cpr_heatmap():
    market_sim.update_ticks()
    return {
        "inside_cpr_bull": [
            {"sym": "APOLLOHOSP", "dots": [1, 1, 1]}, {"sym": "HINDZINC", "dots": [1, 1, 1]},
            {"sym": "SIEMENS", "dots": [1, 1, 1]}, {"sym": "BHEL", "dots": [1, 1, 1]},
            {"sym": "COFORGE", "dots": [1, 1, 1]}, {"sym": "KEI", "dots": [1, 1, 1]},
            {"sym": "PAGEIND", "dots": [1, 1, -1]}, {"sym": "COCHINSHIP", "dots": [1, 1, 1]},
            {"sym": "ABCAPITAL", "dots": [1, 1, 1]}, {"sym": "VMM", "dots": [1, 1, 1]},
            {"sym": "BAJAJFINSV", "dots": [1, 1, 1]}, {"sym": "CANBK", "dots": [1, 1, 1]},
            {"sym": "INDUSTOWER", "dots": [1, 1, 1]}, {"sym": "BANKBARODA", "dots": [1, 1, 1]},
            {"sym": "COALINDIA", "dots": [1, 1, 1]}
        ],
        "inside_cpr_bull_total": 15,
        "level1_bull": [
            {"sym": "RELIANCE", "dots": [1, 1, 1]}, {"sym": "TCS", "dots": [1, 1, 1]},
            {"sym": "TATAMOTORS", "dots": [1, 1, 1]}, {"sym": "HDFCBANK", "dots": [1, 1, 1]}
        ],
        "level1_bull_total": 4,
        "inside_cpr_bear": [
            {"sym": "COLPAL", "dots": [-1, -1, -1]}, {"sym": "ICICIPRULI", "dots": [-1, -1, 1]},
            {"sym": "IRFC", "dots": [-1, -1, -1]}, {"sym": "ADANIGREEN", "dots": [-1, -1, -1]},
            {"sym": "ASHOKLEY", "dots": [-1, -1, -1]}, {"sym": "AUROPHARMA", "dots": [-1, -1, -1]},
            {"sym": "GODFRYPHLP", "dots": [-1, -1, -1]}, {"sym": "SUPREMEIND", "dots": [-1, -1, -1]},
            {"sym": "RVNL", "dots": [-1, -1, -1]}, {"sym": "NIMI150", "dots": [-1, -1, -1]},
            {"sym": "MARUTI", "dots": [-1, -1, -1]}, {"sym": "BOSCHLTD", "dots": [-1, -1, -1]},
            {"sym": "NATIONALUM", "dots": [-1, -1, -1]}, {"sym": "ADANIENT", "dots": [-1, -1, -1]},
            {"sym": "POWERGRID", "dots": [-1, -1, -1]}, {"sym": "PAYTM", "dots": [-1, -1, -1]},
            {"sym": "NAM-INDIA", "dots": [-1, -1, -1]}, {"sym": "ATHERENERG", "dots": [-1, -1, -1]},
            {"sym": "M&M", "dots": [-1, -1, -1]}, {"sym": "TATACONSUM", "dots": [-1, 1, -1]}
        ],
        "inside_cpr_bear_total": 24,
        "level1_bear": [
            {"sym": "INFY", "dots": [-1, -1, -1]}, {"sym": "AXISBANK", "dots": [-1, -1, -1]},
            {"sym": "TATASTEEL", "dots": [-1, -1, -1]}, {"sym": "WIPRO", "dots": [-1, -1, -1]}
        ],
        "level1_bear_total": 4,
        "cpr_wide": [
            {"sym": "INOXWIND", "is_bull": True}, {"sym": "OBEROIRLTY", "is_bull": True},
            {"sym": "PATANJALI", "is_bull": True}, {"sym": "NAUKRI", "is_bull": True},
            {"sym": "YESBANK", "is_bull": True}, {"sym": "RADICO", "is_bull": True},
            {"sym": "POLICYBZR", "is_bull": True}, {"sym": "NYKAA", "is_bull": True},
            {"sym": "MARICO", "is_bull": True}, {"sym": "SRF", "is_bull": True},
            {"sym": "UNITDSPR", "is_bull": True}, {"sym": "SIEMENS", "is_bull": True},
            {"sym": "SUNPHARMA", "is_bull": True}, {"sym": "ITC", "is_bull": True},
            {"sym": "ABCAPITAL", "is_bull": False}, {"sym": "COCHINSHIP", "is_bull": False},
            {"sym": "NMDC", "is_bull": False}, {"sym": "COLPAL", "is_bull": False},
            {"sym": "PAGEIND", "is_bull": False}, {"sym": "GMRAIRPORT", "is_bull": False}
        ],
        "cpr_wide_total": 72,
        "cpr_narrow": [
            {"sym": "360ONE", "is_bull": True}, {"sym": "SUZLON", "is_bull": True},
            {"sym": "MPHASIS", "is_bull": True}, {"sym": "MFSL", "is_bull": True},
            {"sym": "LICHSGFIN", "is_bull": True}, {"sym": "INDHOTEL", "is_bull": True},
            {"sym": "BRITANNIA", "is_bull": True}, {"sym": "MAXHEALTH", "is_bull": True},
            {"sym": "INDIGO", "is_bull": True}, {"sym": "HCLTECH", "is_bull": True},
            {"sym": "SHRIRAMFIN", "is_bull": True}, {"sym": "ONGC", "is_bull": True},
            {"sym": "AMBER", "is_bull": False}, {"sym": "BSE", "is_bull": False},
            {"sym": "GVT&D", "is_bull": False}, {"sym": "TIINDIA", "is_bull": False},
            {"sym": "GODREJCP", "is_bull": False}, {"sym": "INFY", "is_bull": False},
            {"sym": "EICHERMOT", "is_bull": False}
        ],
        "cpr_narrow_total": 19,
        "wide_7": [
            {"sym": "RADICO", "is_bull": True}, {"sym": "SRF", "is_bull": True},
            {"sym": "UNITDSPR", "is_bull": True}, {"sym": "SUNPHARMA", "is_bull": True},
            {"sym": "ABCAPITAL", "is_bull": False}, {"sym": "NMDC", "is_bull": False},
            {"sym": "COLPAL", "is_bull": False}, {"sym": "PAGEIND", "is_bull": False},
            {"sym": "HAVELLS", "is_bull": False}, {"sym": "KPITTECH", "is_bull": False},
            {"sym": "RVNL", "is_bull": False}, {"sym": "PAYTM", "is_bull": False},
            {"sym": "SUPREMEIND", "is_bull": False}, {"sym": "AUROPHARMA", "is_bull": False},
            {"sym": "HINDZINC", "is_bull": False}, {"sym": "COALINDIA", "is_bull": False},
            {"sym": "POWERGRID", "is_bull": False}, {"sym": "NTPC", "is_bull": False},
            {"sym": "TCS", "is_bull": False}, {"sym": "MARUTI", "is_bull": False}
        ],
        "wide_7_total": 44,
        "narrow_7": [
            {"sym": "360ONE", "is_bull": True}, {"sym": "SUZLON", "is_bull": True},
            {"sym": "MPHASIS", "is_bull": True}, {"sym": "MFSL", "is_bull": True},
            {"sym": "LICHSGFIN", "is_bull": True}, {"sym": "INDHOTEL", "is_bull": True},
            {"sym": "BRITANNIA", "is_bull": True}, {"sym": "MAXHEALTH", "is_bull": True},
            {"sym": "INDIGO", "is_bull": True}, {"sym": "HCLTECH", "is_bull": True},
            {"sym": "SHRIRAMFIN", "is_bull": True}, {"sym": "ONGC", "is_bull": True},
            {"sym": "AMBER", "is_bull": False}, {"sym": "BSE", "is_bull": False},
            {"sym": "GVT&D", "is_bull": False}
        ],
        "narrow_7_total": 15,
        "whipsaw_down": [
            {"sym": "ASIANPAINT"}, {"sym": "JIOFIN"}, {"sym": "RECLTD"},
            {"sym": "MPHASIS"}, {"sym": "ICICIPRULI"}
        ],
        "whipsaw_down_total": 5,
        "virgin_cpr_down": []
    }


