import sqlite3
import os
import csv
import hashlib
import math
from datetime import datetime
from typing import Optional, Dict, Any, List

import shutil

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGINAL_DB_PATH = os.path.join(BASE_DIR, "neotrader.db")

# In Vercel serverless environment, the lambda execution directory is read-only.
# We copy neotrader.db to /tmp so SQLite can open, read, and write without operational errors.
if os.environ.get("VERCEL") or not os.access(BASE_DIR, os.W_OK):
    TMP_DB_PATH = "/tmp/neotrader.db"
    if not os.path.exists(TMP_DB_PATH) and os.path.exists(ORIGINAL_DB_PATH):
        try:
            shutil.copy2(ORIGINAL_DB_PATH, TMP_DB_PATH)
        except Exception as e:
            print(f"Notice: Could not copy DB to /tmp ({e}), falling back to {ORIGINAL_DB_PATH}")
    if os.path.exists(TMP_DB_PATH):
        DB_PATH = TMP_DB_PATH
    else:
        DB_PATH = ORIGINAL_DB_PATH
else:
    DB_PATH = ORIGINAL_DB_PATH

INDUSTRY_MAP = {
    'Automobile and Auto Components': 'AUTO',
    'Capital Goods': 'INFRA',
    'Construction': 'INFRA',
    'Construction Materials': 'INFRA',
    'Consumer Durables': 'CONSUMER',
    'Consumer Services': 'CONSUMER',
    'Diversified': 'CONSUMER',
    'Fast Moving Consumer Goods': 'FMCG',
    'Financial Services': 'FINANCE',
    'Healthcare': 'PHARMA',
    'Information Technology': 'IT',
    'Media Entertainment & Publication': 'MEDIA',
    'Metals & Mining': 'METAL',
    'Oil Gas & Consumable Fuels': 'ENERGY',
    'Power': 'ENERGY',
    'Realty': 'REALTY',
    'Services': 'INFRA',
    'Telecommunication': 'TELECOM',
    'Textiles': 'CONSUMER'
}

def infer_sector_from_name(name: str, symbol: str) -> str:
    s = (name + " " + symbol).upper()
    if any(k in s for k in ['BANK', 'PAYMENT BANK']):
        return 'BANKING'
    if any(k in s for k in ['FINANC', 'CAPITAL', 'HOUSING', 'INVEST', 'CREDIT', 'SECURIT', 'HOLDING', 'WEALTH', 'MUTUAL', 'BROKING', 'INSURANCE']):
        return 'FINANCE'
    if any(k in s for k in ['PHARMA', 'DRUG', 'HEALTH', 'LAB', 'LIFE RES', 'BIOTECH', 'REMED', 'MEDIC', 'CLINIC']):
        return 'PHARMA'
    if any(k in s for k in ['TECH', 'INFOTECH', 'SOFT', 'SYSTEMS', 'DIGITAL', 'CYBER', 'INFOWAY']):
        return 'IT'
    if any(k in s for k in ['STEEL', 'METAL', 'MINING', 'MINERAL', 'IRON', 'ALUMIN', 'COPPER', 'ZINC', 'FOILS', 'ALLOY', 'FORG']):
        return 'METAL'
    if any(k in s for k in ['ENERGY', 'POWER', 'OIL', 'PETRO', 'GAS', 'SOLAR', 'RENEW', 'HYDRO', 'THERMAL']):
        return 'ENERGY'
    if any(k in s for k in ['AUTO', 'MOTOR', 'TYRE', 'AUTOMOT', 'VEHICLE', 'SCOOTER']):
        return 'AUTO'
    if any(k in s for k in ['CHEM', 'FERT', 'POLY', 'PLAST', 'CARBON', 'ACID', 'ORGANIC']):
        return 'CHEMICALS'
    if any(k in s for k in ['CEMENT', 'INFRA', 'ENGIN', 'BUILD', 'CONSTR', 'PROJECT', 'ROAD', 'PIPE', 'PORT']):
        return 'INFRA'
    if any(k in s for k in ['REALTY', 'ESTATE', 'DEVELOP', 'PROPERT', 'LAND', 'HOUSING DEV']):
        return 'REALTY'
    if any(k in s for k in ['FOOD', 'BEVERAG', 'BREW', 'SUGAR', 'TEA', 'COFFEE', 'DAIRY', 'FMCG', 'AGRO', 'SPICE', 'GRAIN', 'EDIBLE']):
        return 'FMCG'
    if any(k in s for k in ['MEDIA', 'ENTERTAIN', 'NETWORK', 'BROADCAST', 'FILM', 'CINEMA', 'COMMUNICAT', 'PRINT', 'PUBLISH']):
        return 'MEDIA'
    if any(k in s for k in ['TELECOM', 'TELE-']):
        return 'TELECOM'
    if any(k in s for k in ['TEXTILE', 'APPAREL', 'GARMENT', 'RETAIL', 'FASHION', 'JEWEL', 'HOTEL', 'RESORT', 'TRAVEL', 'AIR']):
        return 'CONSUMER'
    return 'INDUSTRIAL'

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def seed_nse_companies(conn):
    """
    Seeds all 2,559 active NSE companies from official EQUITY_L.csv
    plus authentic F&O overrides, index tags, and deterministic market pricing.
    """
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS nse_companies (
        symbol TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        series TEXT NOT NULL,
        isin TEXT NOT NULL,
        face_value REAL DEFAULT 10.0,
        sector TEXT DEFAULT 'INDUSTRIAL',
        is_fno INTEGER DEFAULT 0,
        is_nifty50 INTEGER DEFAULT 0,
        is_nifty100 INTEGER DEFAULT 0,
        is_nifty500 INTEGER DEFAULT 0,
        is_midcap100 INTEGER DEFAULT 0,
        is_smallcap100 INTEGER DEFAULT 0,
        price REAL DEFAULT 100.0,
        prev_close REAL DEFAULT 100.0,
        high REAL DEFAULT 102.0,
        low REAL DEFAULT 98.0,
        open_price REAL DEFAULT 100.0,
        chg_pct REAL DEFAULT 0.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_nse_sector ON nse_companies(sector)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_nse_fno ON nse_companies(is_fno)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_nse_n500 ON nse_companies(is_nifty500)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_nse_n100 ON nse_companies(is_nifty100)")

    # Lazy import of F&O base stocks and Nifty 50 constituents to avoid circular imports
    from app.market_simulator import STOCKS_BASE, UNIVERSE_MAP
    fno_stocks = {s: d for s, d in STOCKS_BASE.items() if d["type"] != "INDEX"}
    nifty50_set = set(UNIVERSE_MAP.get("NIFTY 50", []))

    # Read Index Constituent CSVs
    n500_industries = {}
    n500_csv = os.path.join(BASE_DIR, "ind_nifty500list.csv")
    if os.path.exists(n500_csv):
        with open(n500_csv, mode="r", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                sym = r.get("Symbol", "").strip()
                ind = r.get("Industry", "").strip()
                if sym:
                    n500_industries[sym] = ind

    n100_set = set()
    n100_csv = os.path.join(BASE_DIR, "ind_nifty100list.csv")
    if os.path.exists(n100_csv):
        with open(n100_csv, mode="r", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                sym = r.get("Symbol", "").strip()
                if sym: n100_set.add(sym)

    mid_set = set()
    mid_csv = os.path.join(BASE_DIR, "ind_niftymidcap100list.csv")
    if os.path.exists(mid_csv):
        with open(mid_csv, mode="r", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                sym = r.get("Symbol", "").strip()
                if sym: mid_set.add(sym)

    sml_set = set()
    sml_csv = os.path.join(BASE_DIR, "ind_niftysmallcap100list.csv")
    if os.path.exists(sml_csv):
        with open(sml_csv, mode="r", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                sym = r.get("Symbol", "").strip()
                if sym: sml_set.add(sym)

    # Read all active stocks from nse_all_stocks.csv
    all_stocks_csv = os.path.join(BASE_DIR, "nse_all_stocks.csv")
    if not os.path.exists(all_stocks_csv):
        print("Warning: nse_all_stocks.csv not found at", all_stocks_csv)
        return

    company_rows = []
    seen_symbols = set()

    with open(all_stocks_csv, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            series = r.get(" SERIES", r.get("SERIES", "")).strip()
            if series not in ("EQ", "BE"):
                continue

            symbol = r.get("SYMBOL", "").strip()
            name = r.get("NAME OF COMPANY", "").strip()
            isin = r.get(" ISIN NUMBER", r.get("ISIN NUMBER", "")).strip()
            fv_str = r.get(" FACE VALUE", r.get("FACE VALUE", "10")).strip()
            try:
                face_val = float(fv_str)
            except ValueError:
                face_val = 10.0

            if not symbol or symbol in seen_symbols:
                continue
            seen_symbols.add(symbol)

            # Determine Sector
            if symbol in fno_stocks:
                sector = fno_stocks[symbol]["sector"]
            elif symbol in n500_industries:
                ind = n500_industries[symbol]
                sector = INDUSTRY_MAP.get(ind, "INDUSTRIAL")
            else:
                sector = infer_sector_from_name(name, symbol)

            # Universe membership flags
            is_fno = 1 if symbol in fno_stocks else 0
            is_nifty50 = 1 if symbol in nifty50_set else 0
            is_nifty100 = 1 if (symbol in n100_set or is_nifty50) else 0
            is_nifty500 = 1 if (symbol in n500_industries or is_nifty100) else 0
            is_midcap = 1 if symbol in mid_set else 0
            is_smallcap = 1 if symbol in sml_set else 0

            # Deterministic price and OHLC calculation
            if symbol in fno_stocks:
                d = fno_stocks[symbol]
                price = d["price"]
                prev_close = d["prev_close"]
                high = d["high"]
                low = d["low"]
                chg = round(price - prev_close, 2)
                chg_pct = round((chg / prev_close) * 100, 2)
                open_p = round(prev_close * (1 + chg_pct * 0.0035), 2)
            else:
                h = int(hashlib.md5(f"{symbol}:{isin}".encode()).hexdigest(), 16)
                price_tiers = [45.0, 120.0, 280.0, 560.0, 1150.0, 2400.0, 4200.0]
                tier_idx = (h % len(price_tiers))
                jitter = ((h >> 8) % 1000) / 1000.0
                base_price = round(price_tiers[tier_idx] * (0.8 + 0.4 * jitter), 2)

                pct_raw = (((h >> 20) % 840) - 360) / 100.0
                chg_pct = round(pct_raw, 2)
                prev_close = base_price
                price = round(prev_close * (1 + chg_pct / 100.0), 2)
                open_p = round(prev_close * (1 + chg_pct * 0.0035), 2)

                high_drift = (((h >> 32) % 150) / 10000.0) + 0.005
                low_drift = (((h >> 40) % 150) / 10000.0) + 0.005
                high = round(max(prev_close, price, open_p) * (1 + high_drift), 2)
                low = round(min(prev_close, price, open_p) * (1 - low_drift), 2)

            company_rows.append((
                symbol, name, series, isin, face_val, sector,
                is_fno, is_nifty50, is_nifty100, is_nifty500, is_midcap, is_smallcap,
                price, prev_close, high, low, open_p, chg_pct
            ))

    # Ensure TATAMOTORS legacy symbol is explicitly present alongside TMCV/TMPV
    if "TATAMOTORS" not in seen_symbols and "TATAMOTORS" in fno_stocks:
        d = fno_stocks["TATAMOTORS"]
        price = d["price"]
        prev_close = d["prev_close"]
        high = d["high"]
        low = d["low"]
        chg = round(price - prev_close, 2)
        chg_pct = round((chg / prev_close) * 100, 2)
        open_p = round(prev_close * (1 + chg_pct * 0.0035), 2)
        company_rows.append((
            "TATAMOTORS", "Tata Motors Limited (Demerged CV/PV)", "EQ", "INE155A01022", 2.0, "AUTO",
            1, 1, 1, 1, 0, 0,
            price, prev_close, high, low, open_p, chg_pct
        ))

    # Batch Insert/Replace
    cursor.executemany("""
    INSERT OR REPLACE INTO nse_companies (
        symbol, name, series, isin, face_value, sector,
        is_fno, is_nifty50, is_nifty100, is_nifty500, is_midcap100, is_smallcap100,
        price, prev_close, high, low, open_price, chg_pct
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, company_rows)
    
    conn.commit()
    print(f"Successfully seeded {len(company_rows)} NSE companies into neotrader.db!")

def init_db():
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Leads / Book Demo table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            country_code TEXT DEFAULT '+91',
            email TEXT NOT NULL,
            source TEXT DEFAULT 'Landing Page Demo',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

        # Paper Trading / My Trades table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS paper_trades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT NOT NULL,
            strategy TEXT NOT NULL,
            alert TEXT NOT NULL,
            entry_price REAL NOT NULL,
            current_price REAL NOT NULL,
            target1 REAL,
            target2 REAL,
            stoploss REAL,
            qty INTEGER DEFAULT 50,
            status TEXT DEFAULT 'ACTIVE',
            pnl REAL DEFAULT 0.0,
            order_type TEXT DEFAULT 'MARKET',
            broker TEXT DEFAULT 'PAPER_TRADE',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

        # Watchlist table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS watchlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT UNIQUE NOT NULL,
            segment TEXT DEFAULT 'EQ',
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

        # Seed default watchlist if empty
        cursor.execute("SELECT COUNT(*) as cnt FROM watchlist")
        if cursor.fetchone()["cnt"] == 0:
            default_symbols = ["RELIANCE", "HDFCBANK", "ICICIBANK", "INFY", "TCS", "TATAMOTORS", "SBIN", "BAJFINANCE"]
            for sym in default_symbols:
                cursor.execute("INSERT OR IGNORE INTO watchlist (symbol) VALUES (?)", (sym,))

        # Seed initial trades in paper_trades for demo portfolio
        cursor.execute("SELECT COUNT(*) as cnt FROM paper_trades")
        if cursor.fetchone()["cnt"] == 0:
            seed_trades = [
                ("RELIANCE", "BREAKOUT-1", "BUY", 2980.50, 3012.00, 3030.00, 3070.00, 2945.00, 50, "ACTIVE", 1575.00, "PAPER_TRADE"),
                ("HDFCBANK", "CAMARILLA-H4", "BUY", 1520.00, 1538.50, 1545.00, 1560.00, 1505.00, 100, "T1 HIT", 1850.00, "PAPER_TRADE"),
                ("INFY", "REVERSAL-2", "SELL", 1680.00, 1665.00, 1650.00, 1630.00, 1700.00, 75, "ACTIVE", 1125.00, "PAPER_TRADE"),
                ("TATAMOTORS", "MOMENTUM-1", "BUY", 965.00, 982.00, 990.00, 1010.00, 950.00, 100, "ACTIVE", 1700.00, "PAPER_TRADE"),
            ]
            for tr in seed_trades:
                cursor.execute("""
                INSERT INTO paper_trades (symbol, strategy, alert, entry_price, current_price, target1, target2, stoploss, qty, status, pnl, broker)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, tr)

        # Seed full NSE companies master table if empty or not fully populated
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='nse_companies'")
        table_exists = cursor.fetchone()
        needs_seed = True
        if table_exists:
            cursor.execute("SELECT COUNT(*) as cnt FROM nse_companies")
            if cursor.fetchone()["cnt"] >= 2500:
                needs_seed = False
                
        if needs_seed:
            seed_nse_companies(conn)

        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Notice: init_db completed with note: {e}")

def get_nse_companies(
    query: Optional[str] = None,
    sector: Optional[str] = None,
    universe: Optional[str] = None,
    page: int = 1,
    page_size: int = 50
) -> Dict[str, Any]:
    """
    Search and paginate across all active NSE companies.
    Supports filtering by text query, sector, or universe tag.
    """
    conn = get_db()
    cursor = conn.cursor()
    
    where_clauses = []
    params = []
    
    if query:
        q_clean = f"%{query.strip().upper()}%"
        where_clauses.append("(UPPER(symbol) LIKE ? OR UPPER(name) LIKE ? OR UPPER(isin) LIKE ?)")
        params.extend([q_clean, q_clean, q_clean])
        
    if sector and sector.upper() != "ALL":
        where_clauses.append("UPPER(sector) = ?")
        params.append(sector.strip().upper())
        
    if universe:
        u_upper = universe.strip().upper()
        if u_upper in ("FNO", "NIFTY FNO"):
            where_clauses.append("is_fno = 1")
        elif u_upper in ("NIFTY 50", "NIFTY50"):
            where_clauses.append("is_nifty50 = 1")
        elif u_upper in ("NIFTY 100", "NIFTY100"):
            where_clauses.append("is_nifty100 = 1")
        elif u_upper in ("NIFTY 500", "NIFTY500"):
            where_clauses.append("is_nifty500 = 1")
        elif u_upper in ("MIDCAP", "NIFTY MIDCAP 100", "MIDCAP100"):
            where_clauses.append("is_midcap100 = 1")
        elif u_upper in ("SMALLCAP", "NIFTY SMLCAP 100", "SMALLCAP100"):
            where_clauses.append("is_smallcap100 = 1")

    where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""
    
    # Total count
    cursor.execute(f"SELECT COUNT(*) as total FROM nse_companies {where_sql}", params)
    total = cursor.fetchone()["total"]
    
    limit = max(1, min(page_size, 500))
    offset = max(0, (page - 1) * limit)
    total_pages = math.ceil(total / limit) if total > 0 else 1
    
    select_sql = f"""
    SELECT symbol, name, series, isin, face_value, sector, 
           is_fno, is_nifty50, is_nifty100, is_nifty500, is_midcap100, is_smallcap100,
           price, prev_close, high, low, open_price, chg_pct
    FROM nse_companies
    {where_sql}
    ORDER BY is_fno DESC, is_nifty50 DESC, chg_pct DESC, symbol ASC
    LIMIT ? OFFSET ?
    """
    cursor.execute(select_sql, params + [limit, offset])
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    
    return {
        "total": total,
        "page": page,
        "page_size": limit,
        "total_pages": total_pages,
        "items": rows
    }

def get_company_by_symbol(symbol: str) -> Optional[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM nse_companies WHERE UPPER(symbol) = ?", (symbol.strip().upper(),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_sectors_summary() -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT sector, COUNT(*) as count, 
           ROUND(AVG(chg_pct), 2) as avg_chg_pct,
           SUM(CASE WHEN chg_pct >= 0 THEN 1 ELSE 0 END) as advances,
           SUM(CASE WHEN chg_pct < 0 THEN 1 ELSE 0 END) as declines
    FROM nse_companies
    GROUP BY sector
    ORDER BY count DESC
    """)
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

def get_universes_summary() -> Dict[str, int]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT 
        COUNT(*) as all_nse,
        SUM(is_fno) as fno,
        SUM(is_nifty50) as nifty50,
        SUM(is_nifty100) as nifty100,
        SUM(is_nifty500) as nifty500,
        SUM(is_midcap100) as midcap100,
        SUM(is_smallcap100) as smallcap100
    FROM nse_companies
    """)
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else {}

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully!")
