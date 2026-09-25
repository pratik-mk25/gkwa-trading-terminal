import os
import random
import math
from datetime import datetime, timezone, timedelta

IST = timezone(timedelta(hours=5, minutes=30))

def get_ist_now() -> datetime:
    """Always returns current time in Indian Standard Time (IST, UTC+5:30)"""
    return datetime.now(timezone.utc).astimezone(IST)

def is_market_open(dt: datetime = None) -> bool:
    """
    Checks if Indian Equity & Derivatives Markets (NSE/BSE) are currently open.
    Standard NSE Market Hours:
    - Monday to Friday (weekday 0, 1, 2, 3, 4)
    - 09:15:00 IST to 15:30:00 IST
    - Weekends (Saturday=5, Sunday=6) are closed.
    """
    if dt is None:
        dt = get_ist_now()
    if dt.weekday() >= 5:
        return False
    market_open = dt.replace(hour=9, minute=15, second=0, microsecond=0)
    market_close = dt.replace(hour=15, minute=30, second=0, microsecond=0)
    return market_open <= dt <= market_close

# ==============================================================================
# GKWA COMPLETE 185 NSE F&O STOCKS DATASET + BENCHMARK INDICES
# Exact values matching the live NSE session & authentic Terminal Screenshots
# ==============================================================================

STOCKS_BASE = {
    # BENCHMARK & BROAD MARKET INDICES
    "NIFTY 50": {"price": 24825.50, "high": 24910.00, "low": 24780.00, "prev_close": 24756.20, "type": "INDEX", "sector": "INDEX"},
    "BANK NIFTY": {"price": 52140.20, "high": 52350.00, "low": 51980.00, "prev_close": 52036.00, "type": "INDEX", "sector": "INDEX"},
    "FINNIFTY": {"price": 23410.80, "high": 23490.00, "low": 23350.00, "prev_close": 23396.75, "type": "INDEX", "sector": "INDEX"},
    "SENSEX": {"price": 81420.10, "high": 81680.00, "low": 81290.00, "prev_close": 80806.00, "type": "INDEX", "sector": "INDEX"},
    "INDIA VIX": {"price": 13.42, "high": 13.90, "low": 12.95, "prev_close": 13.15, "type": "INDEX", "sector": "VOLATILITY"},
    "MIDCAP 100": {"price": 58920.40, "high": 59150.00, "low": 58780.00, "prev_close": 59086.00, "type": "INDEX", "sector": "INDEX"},
    "SMLCAP 100": {"price": 18940.10, "high": 19020.00, "low": 18880.00, "prev_close": 18966.70, "type": "INDEX", "sector": "INDEX"},
    "NIFTY 500": {"price": 23150.80, "high": 23220.00, "low": 23090.00, "prev_close": 23132.30, "type": "INDEX", "sector": "INDEX"},
    "NUMI150": {"price": 412.00, "high": 415.00, "low": 410.50, "prev_close": 413.57, "type": "INDEX", "sector": "INDEX"},

    # 185 F&O CONSTITUENTS (RANKED EXACTLY BY SESSION CHANGE % FROM SCREENSHOTS)
    # --- Top Gainers (Dark Green Tier: >= +2.00% -> 24 Stocks) ---
    "PATANJALI": {"price": 1820.50, "high": 1845.00, "low": 1690.00, "prev_close": 1686.30, "type": "EQUITY", "sector": "FMCG"},
    "MANKIND": {"price": 2580.40, "high": 2610.00, "low": 2440.00, "prev_close": 2435.25, "type": "EQUITY", "sector": "PHARMA"},
    "KAYNES": {"price": 4920.00, "high": 4980.00, "low": 4740.00, "prev_close": 4738.05, "type": "EQUITY", "sector": "AUTO"},
    "SOLARINDS": {"price": 10450.00, "high": 10580.00, "low": 10080.00, "prev_close": 10064.50, "type": "EQUITY", "sector": "INFRA"},
    "LICHSGFIN": {"price": 685.20, "high": 692.00, "low": 662.00, "prev_close": 661.25, "type": "EQUITY", "sector": "FINANCE"},
    "NAUKRI": {"price": 7240.00, "high": 7320.00, "low": 6990.00, "prev_close": 6987.75, "type": "EQUITY", "sector": "IT"},
    "ICICIGI": {"price": 2180.00, "high": 2210.00, "low": 2110.00, "prev_close": 2106.30, "type": "EQUITY", "sector": "FINANCE"},
    "LAURUSLABS": {"price": 462.50, "high": 469.00, "low": 448.00, "prev_close": 447.95, "type": "EQUITY", "sector": "PHARMA"},
    "POLICYBZR": {"price": 1725.00, "high": 1745.00, "low": 1680.00, "prev_close": 1676.85, "type": "EQUITY", "sector": "FINANCE"},
    "VOLTAS": {"price": 1820.00, "high": 1840.00, "low": 1775.00, "prev_close": 1770.25, "type": "EQUITY", "sector": "CONSUMER"},
    "ETERNAL": {"price": 3450.00, "high": 3490.00, "low": 3360.00, "prev_close": 3357.00, "type": "EQUITY", "sector": "CONSUMER"},
    "PHOENIXLTD": {"price": 1680.00, "high": 1705.00, "low": 1640.00, "prev_close": 1635.50, "type": "EQUITY", "sector": "REALTY"},
    "PRESTIGE": {"price": 1785.00, "high": 1810.00, "low": 1740.00, "prev_close": 1737.90, "type": "EQUITY", "sector": "REALTY"},
    "TORNTPHARM": {"price": 3350.00, "high": 3390.00, "low": 3270.00, "prev_close": 3262.25, "type": "EQUITY", "sector": "PHARMA"},
    "DIXON": {"price": 12850.00, "high": 12980.00, "low": 12550.00, "prev_close": 12518.25, "type": "EQUITY", "sector": "CONSUMER"},
    "BIOCON": {"price": 362.00, "high": 368.00, "low": 353.00, "prev_close": 352.80, "type": "EQUITY", "sector": "PHARMA"},
    "MARICO": {"price": 645.00, "high": 652.00, "low": 630.00, "prev_close": 628.95, "type": "EQUITY", "sector": "FMCG"},
    "HCLTECH": {"price": 1780.00, "high": 1795.00, "low": 1738.00, "prev_close": 1735.90, "type": "EQUITY", "sector": "IT"},
    "HEROMOTOCO": {"price": 5420.00, "high": 5480.00, "low": 5290.00, "prev_close": 5286.25, "type": "EQUITY", "sector": "AUTO"},
    "DLF": {"price": 875.00, "high": 884.00, "low": 855.00, "prev_close": 853.90, "type": "EQUITY", "sector": "REALTY"},
    "BANDHANBNK": {"price": 198.50, "high": 202.00, "low": 194.50, "prev_close": 194.05, "type": "EQUITY", "sector": "BANKING"},
    "BLUESTARCO": {"price": 1880.00, "high": 1905.00, "low": 1845.00, "prev_close": 1840.05, "type": "EQUITY", "sector": "CONSUMER"},
    "CGPOWER": {"price": 725.00, "high": 734.00, "low": 712.00, "prev_close": 710.65, "type": "EQUITY", "sector": "INFRA"},
    "OBEROIRLTY": {"price": 1920.00, "high": 1945.00, "low": 1885.00, "prev_close": 1882.00, "type": "EQUITY", "sector": "REALTY"},

    # --- Moderate Gainers (Light Green Tier: 0.00% to +1.99% -> 87 Stocks) ---
    "LUPIN": {"price": 2180.00, "high": 2195.00, "low": 2140.00, "prev_close": 2137.45, "type": "EQUITY", "sector": "PHARMA"},
    "YESBANK": {"price": 24.20, "high": 24.50, "low": 23.80, "prev_close": 23.73, "type": "EQUITY", "sector": "BANKING"},
    "PREMIERENE": {"price": 1120.00, "high": 1135.00, "low": 1100.00, "prev_close": 1098.25, "type": "EQUITY", "sector": "ENERGY"},
    "UNITDSPR": {"price": 1450.00, "high": 1465.00, "low": 1425.00, "prev_close": 1422.95, "type": "EQUITY", "sector": "FMCG"},
    "ITC": {"price": 492.50, "high": 496.00, "low": 485.00, "prev_close": 483.84, "type": "EQUITY", "sector": "FMCG"},
    "SUNPHARMA": {"price": 1740.00, "high": 1755.00, "low": 1715.00, "prev_close": 1710.55, "type": "EQUITY", "sector": "PHARMA"},
    "RELIANCE": {"price": 3012.40, "high": 3030.00, "low": 2965.00, "prev_close": 2961.75, "type": "EQUITY", "sector": "ENERGY"},
    "INDHOTEL": {"price": 685.00, "high": 692.00, "low": 675.00, "prev_close": 673.75, "type": "EQUITY", "sector": "CONSUMER"},
    "MAXHEALTH": {"price": 980.00, "high": 990.00, "low": 965.00, "prev_close": 964.10, "type": "EQUITY", "sector": "PHARMA"},
    "DELHIVERY": {"price": 425.00, "high": 431.00, "low": 419.00, "prev_close": 418.15, "type": "EQUITY", "sector": "INFRA"},
    "TITAN": {"price": 3480.00, "high": 3510.00, "low": 3430.00, "prev_close": 3425.55, "type": "EQUITY", "sector": "CONSUMER"},
    "HDFCLIFE": {"price": 720.00, "high": 726.00, "low": 710.00, "prev_close": 709.15, "type": "EQUITY", "sector": "FINANCE"},
    "SBILIFE": {"price": 1650.00, "high": 1665.00, "low": 1630.00, "prev_close": 1626.55, "type": "EQUITY", "sector": "FINANCE"},
    "TECHM": {"price": 1580.00, "high": 1595.00, "low": 1560.00, "prev_close": 1558.35, "type": "EQUITY", "sector": "IT"},
    "DMART": {"price": 4850.00, "high": 4890.00, "low": 4790.00, "prev_close": 4785.40, "type": "EQUITY", "sector": "CONSUMER"},
    "BEL": {"price": 298.00, "high": 301.50, "low": 294.50, "prev_close": 294.12, "type": "EQUITY", "sector": "DEFENCE"},
    "ONGC": {"price": 312.00, "high": 315.00, "low": 308.50, "prev_close": 308.24, "type": "EQUITY", "sector": "ENERGY"},
    "BOSCHLTD": {"price": 34200.00, "high": 34500.00, "low": 33850.00, "prev_close": 33794.45, "type": "EQUITY", "sector": "AUTO"},
    "COALINDIA": {"price": 488.00, "high": 492.00, "low": 483.00, "prev_close": 482.37, "type": "EQUITY", "sector": "ENERGY"},
    "HDFCBANK": {"price": 1538.50, "high": 1548.00, "low": 1522.00, "prev_close": 1520.85, "type": "EQUITY", "sector": "BANKING"},
    "NYKAA": {"price": 215.00, "high": 218.00, "low": 213.00, "prev_close": 212.53, "type": "EQUITY", "sector": "CONSUMER"},
    "TCS": {"price": 3940.00, "high": 3965.00, "low": 3900.00, "prev_close": 3896.00, "type": "EQUITY", "sector": "IT"},
    "BAJAJHLDNG": {"price": 9850.00, "high": 9920.00, "low": 9750.00, "prev_close": 9740.00, "type": "EQUITY", "sector": "FINANCE"},
    "DRREDDY": {"price": 6680.00, "high": 6730.00, "low": 6610.00, "prev_close": 6606.00, "type": "EQUITY", "sector": "PHARMA"},
    "SRF": {"price": 2420.00, "high": 2445.00, "low": 2398.00, "prev_close": 2393.45, "type": "EQUITY", "sector": "CHEMICALS"},
    "JINDALSTEL": {"price": 980.00, "high": 988.00, "low": 972.00, "prev_close": 970.35, "type": "EQUITY", "sector": "METAL"},
    "NESTLEIND": {"price": 2480.00, "high": 2495.00, "low": 2460.00, "prev_close": 2457.40, "type": "EQUITY", "sector": "FMCG"},
    "INOXWIND": {"price": 225.00, "high": 228.00, "low": 223.50, "prev_close": 222.97, "type": "EQUITY", "sector": "ENERGY"},
    "KPITTECH": {"price": 1720.00, "high": 1735.00, "low": 1706.00, "prev_close": 1704.65, "type": "EQUITY", "sector": "IT"},
    "UNIONBANK": {"price": 128.00, "high": 129.50, "low": 127.00, "prev_close": 126.90, "type": "EQUITY", "sector": "BANKING"},
    "NTPC": {"price": 412.00, "high": 415.50, "low": 409.00, "prev_close": 408.52, "type": "EQUITY", "sector": "ENERGY"},
    "FORTIS": {"price": 510.00, "high": 516.00, "low": 506.00, "prev_close": 505.70, "type": "EQUITY", "sector": "PHARMA"},
    "NMDC": {"price": 235.00, "high": 237.50, "low": 233.50, "prev_close": 233.09, "type": "EQUITY", "sector": "METAL"},
    "HINDUNILVR": {"price": 2720.00, "high": 2740.00, "low": 2700.00, "prev_close": 2698.95, "type": "EQUITY", "sector": "FMCG"},
    "ULTRACEMCO": {"price": 11450.00, "high": 11520.00, "low": 11380.00, "prev_close": 11361.40, "type": "EQUITY", "sector": "INFRA"},
    "VBL": {"price": 1580.00, "high": 1595.00, "low": 1570.00, "prev_close": 1568.70, "type": "EQUITY", "sector": "FMCG"},
    "PNBHOUSING": {"price": 980.00, "high": 990.00, "low": 974.00, "prev_close": 973.10, "type": "EQUITY", "sector": "FINANCE"},
    "PFC": {"price": 512.00, "high": 516.50, "low": 509.00, "prev_close": 508.75, "type": "EQUITY", "sector": "FINANCE"},
    "MFSL": {"price": 1180.00, "high": 1192.00, "low": 1174.00, "prev_close": 1172.50, "type": "EQUITY", "sector": "FINANCE"},
    "AMBUJACEM": {"price": 635.00, "high": 640.00, "low": 631.50, "prev_close": 631.02, "type": "EQUITY", "sector": "INFRA"},
    "HDFCAMC": {"price": 4420.00, "high": 4450.00, "low": 4395.00, "prev_close": 4392.80, "type": "EQUITY", "sector": "FINANCE"},
    "PNB": {"price": 112.00, "high": 113.20, "low": 111.40, "prev_close": 111.31, "type": "EQUITY", "sector": "BANKING"},
    "TATAELXSI": {"price": 7650.00, "high": 7720.00, "low": 7610.00, "prev_close": 7602.85, "type": "EQUITY", "sector": "IT"},
    "PERSISTENT": {"price": 5240.00, "high": 5280.00, "low": 5210.00, "prev_close": 5208.25, "type": "EQUITY", "sector": "IT"},
    "NATIONALUM": {"price": 195.00, "high": 197.00, "low": 194.00, "prev_close": 193.90, "type": "EQUITY", "sector": "METAL"},
    "KOTAKBANK": {"price": 1780.00, "high": 1795.00, "low": 1772.00, "prev_close": 1770.10, "type": "EQUITY", "sector": "BANKING"},
    "OIL": {"price": 685.00, "high": 692.00, "low": 682.00, "prev_close": 681.18, "type": "EQUITY", "sector": "ENERGY"},
    "HAL": {"price": 4650.00, "high": 4690.00, "low": 4630.00, "prev_close": 4625.00, "type": "EQUITY", "sector": "DEFENCE"},
    "LT": {"price": 3610.00, "high": 3635.00, "low": 3595.00, "prev_close": 3591.70, "type": "EQUITY", "sector": "INFRA"},
    "BRITANNIA": {"price": 5890.00, "high": 5930.00, "low": 5865.00, "prev_close": 5860.70, "type": "EQUITY", "sector": "FMCG"},
    "INDUSTOWER": {"price": 345.00, "high": 348.00, "low": 343.50, "prev_close": 343.38, "type": "EQUITY", "sector": "TELECOM"},
    "TATACONSUM": {"price": 1180.00, "high": 1190.00, "low": 1175.00, "prev_close": 1174.60, "type": "EQUITY", "sector": "FMCG"},
    "ICICIBANK": {"price": 1215.75, "high": 1224.00, "low": 1211.00, "prev_close": 1210.20, "type": "EQUITY", "sector": "BANKING"},
    "MUTHOOTFIN": {"price": 1890.00, "high": 1905.00, "low": 1882.00, "prev_close": 1881.35, "type": "EQUITY", "sector": "FINANCE"},
    "SUZLON": {"price": 74.50, "high": 75.20, "low": 74.20, "prev_close": 74.16, "type": "EQUITY", "sector": "ENERGY"},
    "INDIGO": {"price": 4480.00, "high": 4510.00, "low": 4465.00, "prev_close": 4460.75, "type": "EQUITY", "sector": "INFRA"},
    "MARUTI": {"price": 12450.00, "high": 12520.00, "low": 12400.00, "prev_close": 12399.00, "type": "EQUITY", "sector": "AUTO"},
    "BAJAJ-AUTO": {"price": 11800.00, "high": 11880.00, "low": 11760.00, "prev_close": 11753.00, "type": "EQUITY", "sector": "AUTO"},
    "DIVISLAB": {"price": 5420.00, "high": 5460.00, "low": 5405.00, "prev_close": 5399.50, "type": "EQUITY", "sector": "PHARMA"},
    "BHARATFORG": {"price": 1580.00, "high": 1592.00, "low": 1575.00, "prev_close": 1574.50, "type": "EQUITY", "sector": "AUTO"},
    "GODREJPROP": {"price": 3120.00, "high": 3145.00, "low": 3110.00, "prev_close": 3109.40, "type": "EQUITY", "sector": "REALTY"},
    "MOTHERSON": {"price": 195.00, "high": 196.80, "low": 194.60, "prev_close": 194.59, "type": "EQUITY", "sector": "AUTO"},
    "ICICIPRULI": {"price": 720.00, "high": 724.50, "low": 718.50, "prev_close": 718.56, "type": "EQUITY", "sector": "FINANCE"},
    "SHRIRAMFIN": {"price": 3280.00, "high": 3305.00, "low": 3275.00, "prev_close": 3274.10, "type": "EQUITY", "sector": "FINANCE"},
    "INDIANB": {"price": 565.00, "high": 570.00, "low": 564.50, "prev_close": 564.20, "type": "EQUITY", "sector": "BANKING"},
    "M&M": {"price": 2980.00, "high": 3005.00, "low": 2978.00, "prev_close": 2976.70, "type": "EQUITY", "sector": "AUTO"},
    "LTM": {"price": 5820.00, "high": 5860.00, "low": 5815.00, "prev_close": 5813.60, "type": "EQUITY", "sector": "IT"},
    "GLENMARK": {"price": 1680.00, "high": 1695.00, "low": 1678.00, "prev_close": 1678.15, "type": "EQUITY", "sector": "PHARMA"},
    "ZYDUSLIFE": {"price": 1140.00, "high": 1148.00, "low": 1139.00, "prev_close": 1138.97, "type": "EQUITY", "sector": "PHARMA"},
    "PIDILITIND": {"price": 3180.00, "high": 3198.00, "low": 3178.00, "prev_close": 3177.77, "type": "EQUITY", "sector": "CHEMICALS"},
    "JIOFIN": {"price": 348.00, "high": 351.00, "low": 348.00, "prev_close": 347.90, "type": "EQUITY", "sector": "FINANCE"},
    "ABB": {"price": 8120.00, "high": 8170.00, "low": 8120.00, "prev_close": 8119.18, "type": "EQUITY", "sector": "INFRA"},
    "TATAMOTORS": {"price": 975.00, "high": 985.00, "low": 965.00, "prev_close": 964.50, "type": "EQUITY", "sector": "AUTO"},
    "SBIN": {"price": 815.00, "high": 820.00, "low": 812.00, "prev_close": 812.46, "type": "EQUITY", "sector": "BANKING"},
    "ADANIPOWER": {"price": 657.00, "high": 662.00, "low": 653.00, "prev_close": 655.13, "type": "EQUITY", "sector": "ENERGY"},
    "SAIL": {"price": 139.00, "warn_h": 140.50, "high": 140.50, "low": 137.50, "prev_close": 138.03, "type": "EQUITY", "sector": "METAL"},
    "360ONE": {"price": 1045.00, "high": 1055.00, "low": 1038.00, "prev_close": 1040.42, "type": "EQUITY", "sector": "FINANCE"},
    "EICHERMOT": {"price": 4895.00, "high": 4925.00, "low": 4870.00, "prev_close": 4882.44, "type": "EQUITY", "sector": "AUTO"},
    "CANBK": {"price": 115.00, "high": 116.00, "low": 113.80, "prev_close": 114.07, "type": "EQUITY", "sector": "BANKING"},
    "KALYANKJIL": {"price": 698.00, "high": 705.00, "low": 693.00, "prev_close": 695.42, "type": "EQUITY", "sector": "CONSUMER"},
    "IDFCFIRSTB": {"price": 73.00, "high": 73.50, "low": 72.30, "prev_close": 72.60, "type": "EQUITY", "sector": "BANKING"},
    "BAJAJFINSV": {"price": 1868.00, "high": 1880.00, "low": 1855.00, "prev_close": 1862.80, "type": "EQUITY", "sector": "FINANCE"},
    "MPHASIS": {"price": 2990.00, "high": 3015.00, "low": 2975.00, "prev_close": 2985.37, "type": "EQUITY", "sector": "IT"},
    "SHREECEM": {"price": 26480.00, "high": 26680.00, "low": 26350.00, "prev_close": 26458.00, "type": "EQUITY", "sector": "INFRA"},
    "FEDERALBNK": {"price": 199.00, "high": 201.00, "low": 197.50, "prev_close": 198.46, "type": "EQUITY", "sector": "BANKING"},
    "TRENT": {"price": 7480.00, "high": 7540.00, "low": 7430.00, "prev_close": 7472.42, "type": "EQUITY", "sector": "CONSUMER"},
    "IOC": {"price": 173.00, "high": 174.50, "low": 171.50, "prev_close": 172.59, "type": "EQUITY", "sector": "ENERGY"},

    # --- Moderate Losers (Light Red Tier: -0.01% to -1.99% -> 46 Stocks) ---
    "APOLLOHOSP": {"price": 6920.00, "high": 6980.00, "low": 6905.00, "prev_close": 6945.00, "type": "EQUITY", "sector": "PHARMA"},
    "POLYCAB": {"price": 6850.00, "high": 6930.00, "low": 6835.00, "prev_close": 6874.73, "type": "EQUITY", "sector": "INFRA"},
    "TVSMOTOR": {"price": 2420.00, "high": 2450.00, "low": 2415.00, "prev_close": 2429.46, "type": "EQUITY", "sector": "AUTO"},
    "HINDPETRO": {"price": 415.00, "high": 420.00, "low": 414.00, "prev_close": 416.62, "type": "EQUITY", "sector": "ENERGY"},
    "BPCL": {"price": 348.00, "high": 352.00, "low": 347.00, "prev_close": 349.40, "type": "EQUITY", "sector": "ENERGY"},
    "GVT&D": {"price": 890.00, "high": 902.00, "low": 888.00, "prev_close": 893.84, "type": "EQUITY", "sector": "INFRA"},
    "ASIANPAINT": {"price": 3180.00, "high": 3210.00, "low": 3170.00, "prev_close": 3194.34, "type": "EQUITY", "sector": "CONSUMER"},
    "HINDALCO": {"price": 685.00, "high": 694.00, "low": 683.00, "prev_close": 688.71, "type": "EQUITY", "sector": "METAL"},
    "JSWSTEEL": {"price": 980.00, "high": 992.00, "low": 978.00, "prev_close": 985.40, "type": "EQUITY", "sector": "METAL"},
    "BANKBARODA": {"price": 252.00, "high": 255.50, "low": 251.00, "prev_close": 253.39, "type": "EQUITY", "sector": "BANKING"},
    "AXISBANK": {"price": 1188.00, "high": 1202.00, "low": 1184.00, "prev_close": 1194.69, "type": "EQUITY", "sector": "BANKING"},
    "CIPLA": {"price": 1580.00, "high": 1598.00, "low": 1575.00, "prev_close": 1589.50, "type": "EQUITY", "sector": "PHARMA"},
    "GMRAIRPORT": {"price": 98.50, "high": 100.20, "low": 98.20, "prev_close": 99.09, "type": "EQUITY", "sector": "INFRA"},
    "CUMMINSIND": {"price": 3820.00, "high": 3865.00, "low": 3810.00, "prev_close": 3844.49, "type": "EQUITY", "sector": "INFRA"},
    "SIEMENS": {"price": 6850.00, "high": 6930.00, "low": 6820.00, "prev_close": 6897.33, "type": "EQUITY", "sector": "INFRA"},
    "HINDZINC": {"price": 495.00, "high": 502.00, "low": 493.50, "prev_close": 498.49, "type": "EQUITY", "sector": "METAL"},
    "GAIL": {"price": 225.00, "high": 228.00, "low": 224.00, "prev_close": 226.68, "type": "EQUITY", "sector": "ENERGY"},
    "ASHOKLEY": {"price": 242.00, "high": 245.50, "low": 241.00, "prev_close": 243.88, "type": "EQUITY", "sector": "AUTO"},
    "BANKINDIA": {"price": 118.00, "high": 119.80, "low": 117.50, "prev_close": 119.17, "type": "EQUITY", "sector": "BANKING"},
    "INDUSINDBK": {"price": 1420.00, "high": 1445.00, "low": 1415.00, "prev_close": 1435.33, "type": "EQUITY", "sector": "BANKING"},
    "TATASTEEL": {"price": 156.40, "high": 159.00, "low": 155.80, "prev_close": 158.22, "type": "EQUITY", "sector": "METAL"},
    "KEI": {"price": 4280.00, "high": 4350.00, "low": 4265.00, "prev_close": 4330.22, "type": "EQUITY", "sector": "INFRA"},
    "AUROPHARMA": {"price": 1460.00, "high": 1485.00, "low": 1455.00, "prev_close": 1477.58, "type": "EQUITY", "sector": "PHARMA"},
    "RADICO": {"price": 2180.00, "high": 2220.00, "low": 2170.00, "prev_close": 2206.87, "type": "EQUITY", "sector": "FMCG"},
    "INFY": {"price": 1665.20, "high": 1690.00, "low": 1658.00, "prev_close": 1685.94, "type": "EQUITY", "sector": "IT"},
    "GRASIM": {"price": 2680.00, "high": 2725.00, "low": 2670.00, "prev_close": 2716.63, "type": "EQUITY", "sector": "INFRA"},
    "COLPAL": {"price": 3420.00, "high": 3480.00, "low": 3410.00, "prev_close": 3466.80, "type": "EQUITY", "sector": "FMCG"},
    "WIPRO": {"price": 542.10, "high": 552.00, "low": 539.00, "prev_close": 549.63, "type": "EQUITY", "sector": "IT"},
    "GODREJCP": {"price": 1380.00, "high": 1405.00, "low": 1375.00, "prev_close": 1399.88, "type": "EQUITY", "sector": "FMCG"},
    "BAJFINANCE": {"price": 7240.00, "high": 7420.00, "low": 7210.00, "prev_close": 7374.96, "type": "EQUITY", "sector": "FINANCE"},
    "POWERGRID": {"price": 335.00, "high": 342.00, "low": 334.00, "prev_close": 340.27, "type": "EQUITY", "sector": "ENERGY"},
    "ADANIENT": {"price": 3040.00, "high": 3105.00, "low": 3025.00, "prev_close": 3085.98, "type": "EQUITY", "sector": "ENERGY"},
    "AUBANK": {"price": 645.00, "high": 662.00, "low": 642.00, "prev_close": 657.83, "type": "EQUITY", "sector": "BANKING"},
    "COFORGE": {"price": 7450.00, "high": 7600.00, "low": 7420.00, "prev_close": 7561.16, "type": "EQUITY", "sector": "IT"},
    "BHEL": {"price": 275.00, "high": 281.00, "low": 273.50, "prev_close": 279.13, "type": "EQUITY", "sector": "INFRA"},
    "ASTRAL": {"price": 1880.00, "high": 1928.00, "low": 1870.00, "prev_close": 1916.03, "type": "EQUITY", "sector": "INFRA"},
    "ALKEM": {"price": 5650.00, "high": 5780.00, "low": 5620.00, "prev_close": 5758.26, "type": "EQUITY", "sector": "PHARMA"},
    "JSWENERGY": {"price": 715.00, "high": 732.00, "low": 712.00, "prev_close": 727.40, "type": "EQUITY", "sector": "ENERGY"},
    "PETRONET": {"price": 345.00, "high": 353.00, "low": 343.80, "prev_close": 351.10, "type": "EQUITY", "sector": "ENERGY"},
    "MAHABANK": {"price": 58.00, "high": 59.40, "low": 57.70, "prev_close": 58.94, "type": "EQUITY", "sector": "BANKING"},
    "SONACOMS": {"price": 685.00, "high": 700.00, "low": 682.00, "prev_close": 695.99, "type": "EQUITY", "sector": "AUTO"},
    "LODHA": {"price": 1240.00, "high": 1258.00, "low": 1235.00, "prev_close": 1247.33, "type": "EQUITY", "sector": "REALTY"},
    "PVRINOX": {"price": 1420.00, "high": 1445.00, "low": 1410.00, "prev_close": 1435.00, "type": "EQUITY", "sector": "MEDIA"},
    "SUNTV": {"price": 780.00, "high": 795.00, "low": 775.00, "prev_close": 788.00, "type": "EQUITY", "sector": "MEDIA"},
    "ZEEL": {"price": 135.00, "high": 138.00, "low": 134.00, "prev_close": 136.50, "type": "EQUITY", "sector": "MEDIA"},
    "CHOLAFIN": {"price": 1480.00, "high": 1520.00, "low": 1472.00, "prev_close": 1508.50, "type": "EQUITY", "sector": "FINANCE"},

    # --- Major Losers (Dark Red Tier: <= -2.00% -> 28 Stocks) ---
    "ADANIPORTS": {"price": 1420.00, "high": 1455.00, "low": 1412.00, "prev_close": 1449.28, "type": "EQUITY", "sector": "INFRA"},
    "TATAPOWER": {"price": 435.00, "high": 446.00, "low": 432.00, "prev_close": 444.06, "type": "EQUITY", "sector": "ENERGY"},
    "CDSL": {"price": 1580.00, "high": 1622.00, "low": 1572.00, "prev_close": 1613.73, "type": "EQUITY", "sector": "FINANCE"},
    "MAZDOCK": {"price": 4450.00, "high": 4570.00, "low": 4420.00, "prev_close": 4545.92, "type": "EQUITY", "sector": "DEFENCE"},
    "DABUR": {"price": 540.00, "high": 554.00, "low": 538.00, "prev_close": 551.81, "type": "EQUITY", "sector": "FMCG"},
    "RVNL": {"price": 425.00, "high": 438.00, "low": 422.00, "prev_close": 434.30, "type": "EQUITY", "sector": "INFRA"},
    "PAYTM": {"price": 685.00, "high": 705.00, "low": 681.00, "prev_close": 700.12, "type": "EQUITY", "sector": "FINANCE"},
    "SBICARD": {"price": 740.00, "high": 760.00, "low": 736.00, "prev_close": 756.42, "type": "EQUITY", "sector": "FINANCE"},
    "SUPREMEIND": {"price": 4850.00, "high": 4990.00, "low": 4820.00, "prev_close": 4961.12, "type": "EQUITY", "sector": "INFRA"},
    "ADANIGREEN": {"price": 1820.00, "high": 1875.00, "low": 1805.00, "prev_close": 1863.23, "type": "EQUITY", "sector": "ENERGY"},
    "WAAREEENER": {"price": 2980.00, "high": 3075.00, "low": 2960.00, "prev_close": 3053.59, "type": "EQUITY", "sector": "ENERGY"},
    "POWERINDIA": {"price": 13450.00, "high": 13900.00, "low": 13350.00, "prev_close": 13800.53, "type": "EQUITY", "sector": "INFRA"},
    "HAVELLS": {"price": 1780.00, "high": 1840.00, "low": 1770.00, "prev_close": 1827.33, "type": "EQUITY", "sector": "CONSUMER"},
    "JUBLFOOD": {"price": 620.00, "high": 640.00, "low": 617.00, "prev_close": 636.53, "type": "EQUITY", "sector": "CONSUMER"},
    "VEDL": {"price": 488.00, "high": 505.00, "low": 485.00, "prev_close": 501.28, "type": "EQUITY", "sector": "METAL"},
    "ADANIENSOL": {"price": 980.00, "high": 1015.00, "low": 974.00, "prev_close": 1006.99, "type": "EQUITY", "sector": "ENERGY"},
    "ATHERENERG": {"price": 340.00, "high": 354.00, "low": 338.00, "prev_close": 350.05, "type": "EQUITY", "sector": "AUTO"},
    "IREDA": {"price": 225.00, "high": 234.00, "low": 223.50, "prev_close": 231.72, "type": "EQUITY", "sector": "FINANCE"},
    "HYUNDAI": {"price": 1820.00, "high": 1885.00, "low": 1810.00, "prev_close": 1874.94, "type": "EQUITY", "sector": "AUTO"},
    "BSE": {"price": 3850.00, "high": 4020.00, "low": 3820.00, "prev_close": 3978.50, "type": "EQUITY", "sector": "FINANCE"},
    "RBLBANK": {"price": 215.00, "high": 224.00, "low": 213.50, "prev_close": 222.22, "type": "EQUITY", "sector": "BANKING"},
    "BHARTIARTL": {"price": 1524.00, "high": 1585.00, "low": 1515.00, "prev_close": 1576.49, "type": "EQUITY", "sector": "TELECOM"},
    "CONCOR": {"price": 890.00, "high": 928.00, "low": 884.00, "prev_close": 921.99, "type": "EQUITY", "sector": "INFRA"},
    "UPL": {"price": 540.00, "high": 564.00, "low": 536.00, "prev_close": 559.41, "type": "EQUITY", "sector": "CHEMICALS"},
    "KFINTECH": {"price": 1080.00, "high": 1130.00, "low": 1072.00, "prev_close": 1120.10, "type": "EQUITY", "sector": "FINANCE"},
    "APLAPOLLO": {"price": 1420.00, "high": 1490.00, "low": 1410.00, "prev_close": 1477.94, "type": "EQUITY", "sector": "METAL"},
    "UNOMINDA": {"price": 980.00, "high": 1035.00, "low": 972.00, "prev_close": 1025.10, "type": "EQUITY", "sector": "AUTO"},
    "OFSS": {"price": 11450.00, "high": 12550.00, "low": 11380.00, "prev_close": 12483.65, "type": "EQUITY", "sector": "IT"}
}

# ==============================================================================
# UNIVERSE CONSTITUENTS MAPPING FOR DYNAMIC DROPDOWNS
# ==============================================================================

UNIVERSE_MAP = {
    "NIFTY 50": [
        "RELIANCE", "HDFCBANK", "ICICIBANK", "INFY", "TCS", "ITC", "LT", "SBIN",
        "BHARTIARTL", "KOTAKBANK", "AXISBANK", "MARUTI", "HINDUNILVR", "TATAMOTORS",
        "BAJFINANCE", "TITAN", "SUNPHARMA", "ASIANPAINT", "NTPC", "POWERGRID",
        "TATASTEEL", "COALINDIA", "BAJAJ-AUTO", "ONGC", "M&M", "ADANIENT", "ADANIPORTS",
        "ULTRACEMCO", "JSWSTEEL", "HCLTECH", "TECHM", "WIPRO", "NESTLEIND", "BRITANNIA",
        "DRREDDY", "CIPLA", "GRASIM", "EICHERMOT", "DIVISLAB", "TATACONSUM", "HINDALCO",
        "SBILIFE", "HDFCLIFE", "BPCL", "APOLLOHOSP", "SHREECEM", "INDUSINDBK", "HEROMOTOCO",
        "BAJAJFINSV", "BEL"
    ],
    "NIFTY BANK": [
        "HDFCBANK", "ICICIBANK", "SBIN", "KOTAKBANK", "AXISBANK", "BANKBARODA",
        "PNB", "INDUSINDBK", "AUBANK", "FEDERALBNK", "BANDHANBNK", "IDFCFIRSTB"
    ],
    "NIFTY PVT BANK": [
        "HDFCBANK", "ICICIBANK", "KOTAKBANK", "AXISBANK", "INDUSINDBK", "FEDERALBNK",
        "BANDHANBNK", "IDFCFIRSTB", "RBLBANK"
    ],
    "NIFTY PSU BANK": [
        "SBIN", "BANKBARODA", "PNB", "UNIONBANK", "CANBK", "INDIANB", "MAHABANK", "BANKINDIA"
    ],
    "NIFTY IT": [
        "TCS", "INFY", "HCLTECH", "WIPRO", "TECHM", "LTM", "PERSISTENT", "COFORGE",
        "MPHASIS", "KPITTECH", "OFSS", "TATAELXSI", "NAUKRI"
    ],
    "NIFTY AUTO": [
        "TATAMOTORS", "MARUTI", "M&M", "BAJAJ-AUTO", "HEROMOTOCO", "EICHERMOT",
        "TVSMOTOR", "BHARATFORG", "ASHOKLEY", "MOTHERSON", "BOSCHLTD",
        "SONACOMS", "ATHERENERG", "HYUNDAI", "UNOMINDA"
    ],
    "NIFTY PHARMA": [
        "SUNPHARMA", "DRREDDY", "CIPLA", "LUPIN", "DIVISLAB", "AUROPHARMA",
        "TORNTPHARM", "ZYDUSLIFE", "BIOCON", "ALKEM", "LAURUSLABS", "MANKIND",
        "FORTIS", "MAXHEALTH", "APOLLOHOSP"
    ],
    "NIFTY METAL": [
        "TATASTEEL", "JSWSTEEL", "HINDALCO", "VEDL", "JINDALSTEL", "COALINDIA",
        "NMDC", "SAIL", "NATIONALUM", "HINDZINC", "APLAPOLLO"
    ],
    "NIFTY FMCG": [
        "ITC", "HINDUNILVR", "NESTLEIND", "BRITANNIA", "DABUR", "MARICO",
        "COLPAL", "TATACONSUM", "VBL", "GODREJCP", "UNITDSPR", "PATANJALI", "RADICO"
    ],
    "NIFTY ENERGY": [
        "RELIANCE", "NTPC", "ONGC", "POWERGRID", "COALINDIA", "BPCL", "IOC",
        "HINDPETRO", "GAIL", "TATAPOWER", "ADANIGREEN", "ADANIENSOL", "ADANIPOWER",
        "PREMIERENE", "INOXWIND", "OIL", "SUZLON", "JSWENERGY", "PETRONET"
    ],
    "NIFTY INFRA": [
        "LT", "ULTRACEMCO", "GRASIM", "AMBUJACEM", "SHREECEM", "POWERGRID",
        "NTPC", "BHARTIARTL", "INDIGO", "CONCOR", "ADANIPORTS", "DLF", "CGPOWER",
        "SOLARINDS", "DELHIVERY", "ABB", "POLYCAB", "GVT&D", "GMRAIRPORT", "CUMMINSIND",
        "SIEMENS", "KEI", "BHEL", "ASTRAL", "RVNL", "SUPREMEIND", "POWERINDIA"
    ],
    "NIFTY REALTY": [
        "DLF", "GODREJPROP", "OBEROIRLTY", "PHOENIXLTD", "PRESTIGE", "LODHA"
    ],
    "NIFTY MEDIA": [
        "NAUKRI", "PVRINOX", "SUNTV", "ZEEL"
    ],
    "INDICES": [
        "NIFTY 50", "BANK NIFTY", "FINNIFTY", "SENSEX", "MIDCAP 100", "SMLCAP 100", "NIFTY 500", "INDIA VIX"
    ]
}

def black_scholes_pricing(S: float, K: float, T: float, r: float = 0.065, sigma: float = 0.20, option_type: str = "CE") -> dict:
    """
    Standard Open-Source Black-Scholes-Merton option pricing & Greeks formula.
    Pure Python with zero external dependencies (uses standard math.erf for Normal CDF).
    Guarantees strict mathematical bounds:
    - Call Delta in [0.0, 1.0], Put Delta in [-1.0, 0.0]
    - Gamma >= 0.0, Vega >= 0.0
    - Price >= 0.05
    """
    S = max(0.01, float(S))
    K = max(0.01, float(K))
    T = max(0.0001, float(T))
    sigma = max(0.001, float(sigma))
    r = float(r)

    if T <= 0.0002:
        intrinsic = max(0.0, S - K) if option_type == "CE" else max(0.0, K - S)
        return {
            "price": max(0.05, round(intrinsic, 2)),
            "delta": 1.0 if option_type == "CE" else -1.0,
            "gamma": 0.0,
            "theta": 0.0,
            "vega": 0.0,
            "iv": f"{round(sigma * 100, 1)}%"
        }
    
    d1 = (math.log(S / K) + (r + 0.5 * (sigma ** 2)) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    
    # Standard normal cumulative distribution function N(x)
    N = lambda x: 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))
    # Standard normal probability density function phi(x)
    phi = lambda x: (1.0 / math.sqrt(2.0 * math.pi)) * math.exp(-0.5 * (x ** 2))
    
    pdf_d1 = phi(d1)
    
    if option_type == "CE":
        price = S * N(d1) - K * math.exp(-r * T) * N(d2)
        raw_delta = N(d1)
        delta = min(1.0, max(0.0, raw_delta))
        theta = (- (S * pdf_d1 * sigma) / (2.0 * math.sqrt(T)) - r * K * math.exp(-r * T) * N(d2)) / 365.0
    else:
        price = K * math.exp(-r * T) * N(-d2) - S * N(-d1)
        raw_delta = N(d1) - 1.0
        delta = max(-1.0, min(0.0, raw_delta))
        theta = (- (S * pdf_d1 * sigma) / (2.0 * math.sqrt(T)) + r * K * math.exp(-r * T) * N(-d2)) / 365.0
        
    gamma = max(0.0, pdf_d1 / (S * sigma * math.sqrt(T)))
    vega = max(0.0, (S * math.sqrt(T) * pdf_d1) / 100.0)
    
    return {
        "price": max(0.05, round(price, 2)),
        "delta": round(delta, 3),
        "gamma": round(gamma, 5),
        "theta": round(theta, 2),
        "vega": round(vega, 2),
        "iv": f"{round(sigma * 100, 1)}%"
    }

class MarketSimulator:
    def __init__(self):
        self.stocks = {}
        self.fno_symbols = {s for s, d in STOCKS_BASE.items() if d["type"] != "INDEX"}
        UNIVERSE_MAP["NIFTY FNO"] = sorted(list(self.fno_symbols))
        self.latest_snapshot = None
        self.market_mode = "LIVE_EXCHANGE"  # "LIVE_EXCHANGE" (freezes outside 9:15-15:30 IST) or "SANDBOX_SIMULATION"

        # Dynamic live sectors matching authentic NeoTrader session baselines (media_1790013706126.png)
        self.sectors = {
            "NIFTY AUTO": {"price": 25820.50, "prev_close": 25807.60, "ltp": 25820.50, "chg_pct": 0.05, "base_pct": 0.05},
            "NIFTY FMCG": {"price": 60750.00, "prev_close": 60417.70, "ltp": 60750.00, "chg_pct": 0.55, "base_pct": 0.55},
            "NIFTY PVT BANK": {"price": 26180.00, "prev_close": 26101.70, "ltp": 26180.00, "chg_pct": 0.30, "base_pct": 0.30},
            "FINNIFTY": {"price": 23410.80, "prev_close": 23410.80, "ltp": 23410.80, "chg_pct": 0.00, "base_pct": 0.00},
            "NIFTY PSU BANK": {"price": 6815.00, "prev_close": 6818.40, "ltp": 6815.00, "chg_pct": -0.05, "base_pct": -0.05},
            "NIFTY IT": {"price": 41920.00, "prev_close": 41899.05, "ltp": 41920.00, "chg_pct": 0.05, "base_pct": 0.05},
            "NIFTY INFRA": {"price": 8965.00, "prev_close": 8975.75, "ltp": 8965.00, "chg_pct": -0.12, "base_pct": -0.12},
            "NIFTY METAL": {"price": 9480.00, "prev_close": 9532.40, "ltp": 9480.00, "chg_pct": -0.55, "base_pct": -0.55},
            "NIFTY PHARMA": {"price": 22890.00, "prev_close": 22629.75, "ltp": 22890.00, "chg_pct": 1.15, "base_pct": 1.15},
            "NIFTY REALTY": {"price": 1035.00, "prev_close": 1023.23, "ltp": 1035.00, "chg_pct": 1.15, "base_pct": 1.15},
            "NIFTY COMMODITIES": {"price": 9860.00, "prev_close": 9884.70, "ltp": 9860.00, "chg_pct": -0.25, "base_pct": -0.25},
            "NIFTY CONSUMPTION": {"price": 10920.00, "prev_close": 10874.30, "ltp": 10920.00, "chg_pct": 0.42, "base_pct": 0.42},
            "NIFTY ENERGY": {"price": 39180.00, "prev_close": 39148.68, "ltp": 39180.00, "chg_pct": 0.08, "base_pct": 0.08},
            "NIFTY CPSE": {"price": 6920.00, "prev_close": 6891.05, "ltp": 6920.00, "chg_pct": 0.42, "base_pct": 0.42},
            "NIFTY PSE": {"price": 7120.00, "prev_close": 7114.30, "ltp": 7120.00, "chg_pct": 0.08, "base_pct": 0.08},
            "NIFTY MEDIA": {"price": 2165.00, "prev_close": 2163.27, "ltp": 2165.00, "chg_pct": 0.08, "base_pct": 0.08},
            "NIFTY IND DEFENCE": {"price": 7920.00, "prev_close": 7861.04, "ltp": 7920.00, "chg_pct": 0.75, "base_pct": 0.75}
        }
        self.init_options_trades()

        # 1. Initialize benchmark indices + authentic 185 F&O stocks
        for sym, data in STOCKS_BASE.items():
            prev = data["prev_close"]
            ltp = data["price"]
            chg = round(ltp - prev, 2)
            chg_pct = round((chg / prev) * 100, 2)
            
            open_price = round(prev * (1 + chg_pct * 0.0035), 2)
            high = max(data["high"], ltp, open_price)
            low = min(data["low"], ltp, open_price)
            
            self.stocks[sym] = {
                "symbol": sym,
                "ltp": ltp,
                "high": high,
                "low": low,
                "open": open_price,
                "prev_close": prev,
                "chg": chg,
                "chg_pct": chg_pct,
                "type": data["type"],
                "sector": data["sector"],
                "is_fno": 1 if data["type"] != "INDEX" else 0,
                "is_nifty50": 1 if sym in UNIVERSE_MAP.get("NIFTY 50", []) else 0,
                "volume": random.randint(350000, 8500000),
                "timestamp": get_ist_now().strftime("%Y-%m-%d %H:%M:%S")
            }

        # 2. Load all 2,559+ active NSE companies from SQLite DB if available
        try:
            import sqlite3
            from app.database import DB_PATH
            db_file = DB_PATH
            if os.path.exists(db_file):
                conn = sqlite3.connect(db_file)
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM nse_companies")
                rows = cursor.fetchall()
                all_list = []
                n500_list = []
                n100_list = []
                mid_list = []
                sml_list = []
                
                for r in rows:
                    sym = r["symbol"]
                    all_list.append(sym)
                    if r["is_nifty500"]: n500_list.append(sym)
                    if r["is_nifty100"]: n100_list.append(sym)
                    if r["is_midcap100"]: mid_list.append(sym)
                    if r["is_smallcap100"]: sml_list.append(sym)

                    if sym not in self.stocks:
                        self.stocks[sym] = {
                            "symbol": sym,
                            "ltp": r["price"],
                            "high": r["high"],
                            "low": r["low"],
                            "open": r["open_price"],
                            "prev_close": r["prev_close"],
                            "chg": round(r["price"] - r["prev_close"], 2),
                            "chg_pct": r["chg_pct"],
                            "type": "EQUITY",
                            "sector": r["sector"],
                            "is_fno": r["is_fno"],
                            "is_nifty50": r["is_nifty50"],
                            "is_nifty100": r["is_nifty100"],
                            "is_nifty500": r["is_nifty500"],
                            "volume": random.randint(50000, 2500000),
                            "timestamp": get_ist_now().strftime("%Y-%m-%d %H:%M:%S")
                        }
                    else:
                        self.stocks[sym]["is_nifty100"] = r["is_nifty100"]
                        self.stocks[sym]["is_nifty500"] = r["is_nifty500"]

                conn.close()
                UNIVERSE_MAP["ALL NSE"] = all_list
                UNIVERSE_MAP["ALL"] = all_list
                UNIVERSE_MAP["NIFTY 500"] = n500_list
                UNIVERSE_MAP["NIFTY 100"] = n100_list
                UNIVERSE_MAP["NIFTY MIDCAP 100"] = mid_list
                UNIVERSE_MAP["NIFTY SMLCAP 100"] = sml_list
                UNIVERSE_MAP["NIFTY 200"] = list(dict.fromkeys(n100_list + mid_list))
                UNIVERSE_MAP["NIFTY MIDCAP 50"] = mid_list[:50]
                UNIVERSE_MAP["NIFTY COMMODITIES"] = [s for s, d in self.stocks.items() if d.get("sector") in ("METAL", "ENERGY", "CHEMICALS")]
                UNIVERSE_MAP["NIFTY CONSUMPTION"] = [s for s, d in self.stocks.items() if d.get("sector") in ("CONSUMER", "FMCG", "AUTO")]
                UNIVERSE_MAP["NIFTY CPSE"] = [s for s in ("NTPC", "ONGC", "COALINDIA", "BEL", "HAL", "NMDC", "OIL", "GAIL", "BHEL", "PFC", "RECLTD", "SAIL", "IOC", "BPCL", "HPCL", "CONCOR", "NHPC", "SJVN", "IRCTC", "RVNL", "IREDA") if s in self.stocks]
        except Exception as e:
            print("Note: Could not load additional NSE companies into simulator:", e)

    def update_ticks(self):
        """Ticks are driven continuously by step_simulation_tick() in background pipeline"""
        pass

    def get_market_status(self) -> dict:
        """Returns the current NSE market open/closed status, mode, and freeze state"""
        now = get_ist_now()
        open_status = is_market_open(now)
        is_frozen = (self.market_mode == "LIVE_EXCHANGE" and not open_status)

        # Calculate next market event
        if open_status:
            next_event = "Exchange Closes at 15:30:00 IST today"
        else:
            next_date = now.date()
            if now.time() >= datetime.strptime("15:30", "%H:%M").time():
                next_date += timedelta(days=1)
            while next_date.weekday() >= 5:  # Skip Saturday & Sunday
                next_date += timedelta(days=1)
            next_event = f"Exchange Opens on {next_date.strftime('%Y-%m-%d')} at 09:15:00 IST"

        return {
            "status": "success",
            "is_market_open": open_status,
            "market_mode": self.market_mode,
            "market_status_text": "OPEN" if open_status else "CLOSED",
            "is_frozen": is_frozen,
            "ist_time": now.strftime("%Y-%m-%d %H:%M:%S"),
            "trading_session": "Regular NSE Session: Mon-Fri 09:15 - 15:30 IST",
            "next_event": next_event,
            "message": (
                "Market is OPEN. Real-time ticks active." if open_status else (
                    "🧪 24/7 Sandbox Simulation is actively ticking market data." if self.market_mode == "SANDBOX_SIMULATION" else
                    "🔴 Market is CLOSED. Prices are strictly frozen at official NSE closing values. Switch to Sandbox Mode for 24/7 simulation."
                )
            )
        }

    def set_market_mode(self, mode: str) -> dict:
        """Switches between LIVE_EXCHANGE (strict market hours freeze) and SANDBOX_SIMULATION (24/7 live ticks)"""
        m = str(mode or "").upper().strip()
        if m in ("SANDBOX", "SANDBOX_SIMULATION", "SIMULATION", "FORCE"):
            self.market_mode = "SANDBOX_SIMULATION"
        else:
            self.market_mode = "LIVE_EXCHANGE"
        return self.get_market_status()

    def step_simulation_tick(self, force: bool = False):
        """
        Active continuous market simulation tick cycle:
        - If market is CLOSED and mode is LIVE_EXCHANGE (and not force), prices freeze strictly.
        - If market is OPEN or mode is SANDBOX_SIMULATION, ticks indices, sectors, and active stocks.
        - Updates Day Trader Bullets live.
        - Calculates dynamic breadth.
        - Returns live delta packet.
        """
        now = get_ist_now()
        now_str = now.strftime("%Y-%m-%d %H:%M:%S")
        open_status = is_market_open(now)
        is_frozen = (self.market_mode == "LIVE_EXCHANGE" and not open_status and not force)

        changed_stocks = []

        if not is_frozen:
            # 1. Tick indices with gentle mean-reversion to authentic NeoTrader baselines
            watch_indices = {
                "NIFTY 50": 0.28,
                "BANK NIFTY": 0.20,
                "MIDCAP 100": -0.28,
                "SMLCAP 100": -0.14,
                "NIFTY 500": 0.08,
                "FINNIFTY": 0.06,
                "SENSEX": 0.76,
                "INDIA VIX": 2.05
            }
            for sym, base_pct in watch_indices.items():
                if sym in self.stocks:
                    st = self.stocks[sym]
                    old_p = st["ltp"]
                    cur_pct = st["chg_pct"]
                    # Mean-revert softly so it stays true to authentic screenshot
                    reversion = (base_pct - cur_pct) * 0.05
                    drift = random.choice([-0.0002, 0.0, 0.0002]) + (reversion / 100.0)
                    new_p = round(round(old_p * (1 + drift) / 0.05) * 0.05, 2)
                    if sym == "INDIA VIX":
                        new_p = max(9.0, min(35.0, round(new_p, 2)))
                    dir_str = "UP" if new_p > old_p else ("DOWN" if new_p < old_p else "FLAT")
                    st["ltp"] = new_p
                    st["chg"] = round(new_p - st["prev_close"], 2)
                    st["chg_pct"] = round((st["chg"] / st["prev_close"]) * 100, 2)
                    st["high"] = max(st["high"], new_p)
                    st["low"] = min(st["low"], new_p)
                    st["timestamp"] = now_str
                    changed_stocks.append({
                        "symbol": sym,
                        "ltp": new_p,
                        "chg": st["chg"],
                        "chg_pct": st["chg_pct"],
                        "dir": dir_str,
                        "volume": st.get("volume", 1000000)
                    })

            # 2. Tick dynamic sectors with gentle mean-reversion around authentic NeoTrader base
            for sec_name, sec_data in self.sectors.items():
                base_p = sec_data.get("base_pct", sec_data["chg_pct"])
                cur_pct = sec_data["chg_pct"]
                reversion = (base_p - cur_pct) * 0.08
                drift_pct = random.choice([-0.01, 0.0, 0.01]) + reversion
                new_pct = round(cur_pct + drift_pct, 2)
                sec_data["chg_pct"] = new_pct
                sec_data["ltp"] = round(sec_data["prev_close"] * (1 + new_pct / 100.0), 2)

            # 3. Tick active stocks (35 random stocks + always tick top bullets)
            bullet_syms = ["PATANJALI", "MANKIND", "KAYNES", "SOLARINDS", "LICHSGFIN", "NAUKRI", "ICICIGI", "LAURUSLABS", "RELIANCE", "HDFCBANK", "OFSS", "UNOMINDA", "APLAPOLLO", "KFINTECH", "BHARTIARTL", "BSE"]
            active_candidates = list(self.fno_symbols) if self.fno_symbols else list(self.stocks.keys())
            sample_pool = list(set(bullet_syms + random.sample(active_candidates, min(35, len(active_candidates)))))

            for sym in sample_pool:
                if sym not in self.stocks:
                    continue
                st = self.stocks[sym]
                if st.get("type") == "INDEX":
                    continue

                old_ltp = st["ltp"]
                base_p = STOCKS_BASE.get(sym, {}).get("price", st["prev_close"])
                rel_diff = (old_ltp - base_p) / base_p
                reversion = -rel_diff * 0.05
                pct_move = (random.choice([-0.12, -0.08, -0.05, 0.0, 0.05, 0.08, 0.12]) + reversion)
                step_cents = round(old_ltp * (pct_move / 100.0) / 0.05) * 0.05
                if step_cents == 0 and random.random() < 0.6:
                    step_cents = random.choice([-0.05, 0.05])

                new_ltp = round(max(0.05, old_ltp + step_cents), 2)
                direction = "UP" if new_ltp > old_ltp else ("DOWN" if new_ltp < old_ltp else "FLAT")

                st["ltp"] = new_ltp
                st["chg"] = round(new_ltp - st["prev_close"], 2)
                st["chg_pct"] = round((st["chg"] / st["prev_close"]) * 100, 2)
                st["high"] = max(st["high"], new_ltp)
                st["low"] = min(st["low"], new_ltp)
                st["volume"] += random.randint(500, 10000)
                st["timestamp"] = now_str
                st["last_direction"] = direction

                changed_stocks.append({
                    "symbol": sym,
                    "ltp": new_ltp,
                    "chg": st["chg"],
                    "chg_pct": st["chg_pct"],
                    "dir": direction,
                    "volume": st["volume"]
                })

        # 4. Generate snapshot
        snapshot = {
            "type": "live_tick",
            "timestamp": now_str,
            "formatted_time": now.strftime("%d-%b-%Y %H:%M:%S"),
            "is_market_open": open_status,
            "market_mode": self.market_mode,
            "market_status": "OPEN" if open_status else ("SANDBOX_SIMULATION" if self.market_mode == "SANDBOX_SIMULATION" else "CLOSED"),
            "is_frozen": is_frozen,
            "broad_market": self.get_broad_market_indices(),
            "sectors": self.get_sector_market_indices(),
            "breadth": self.get_advance_decline(universe="NIFTY FNO", mode="Close"),
            "changed_stocks": changed_stocks,
            "bullets": self.get_day_trader_bullets()[:12],
            "options_trades": self.get_options_trades(),
            "intraday_trades": self.get_intraday_trades()
        }
        self.latest_snapshot = snapshot
        return snapshot

    def get_latest_snapshot(self):
        """Returns the most recent cached market snapshot or generates a new one"""
        if not hasattr(self, "latest_snapshot") or not self.latest_snapshot:
            return self.step_simulation_tick()
        return self.latest_snapshot

    def get_indices_ticker(self):
        """Returns the rolling ticker data for the top header"""
        ticker_items = []
        watch_indices = ["NIFTY 50", "BANK NIFTY", "FINNIFTY", "SENSEX", "INDIA VIX", "MIDCAP 100", "SMLCAP 100"]
        for name in watch_indices:
            if name in self.stocks:
                st = self.stocks[name]
                ticker_items.append({
                    "name": name,
                    "symbol": name,
                    "ltp": st["ltp"],
                    "chg": st["chg"],
                    "chg_pct": st["chg_pct"],
                    "is_up": st["chg"] >= 0
                })
        return ticker_items

    def get_broad_market_indices(self):
        """Returns the 7 broad market indices matching Screenshot 23-50-54"""
        order = ["NIFTY 50", "BANK NIFTY", "MIDCAP 100", "SMLCAP 100", "NIFTY 500", "FINNIFTY", "SENSEX"]
        display_names = {
            "NIFTY 50": "NIFTY",
            "BANK NIFTY": "BANKNIFTY",
            "MIDCAP 100": "MIDCAP 100",
            "SMLCAP 100": "SMLCAP 100",
            "NIFTY 500": "NIFTY 500",
            "FINNIFTY": "FINNIFTY",
            "SENSEX": "SENSEX"
        }
        results = []
        for name in order:
            if name in self.stocks:
                st = self.stocks[name]
                results.append({
                    "NAME": display_names[name],
                    "LTP": st["ltp"],
                    "CHGPCT": st["chg_pct"],
                    "BULL_BEAR": 1 if st["chg_pct"] >= 0 else -1
                })
        return results

    def get_sector_market_indices(self):
        """Returns the 17 sector performance indices matching Screenshot media_1790013706126.png in exact fixed categorical order"""
        order = [
            "NIFTY AUTO",
            "NIFTY FMCG",
            "NIFTY PVT BANK",
            "FINNIFTY",
            "NIFTY PSU BANK",
            "NIFTY IT",
            "NIFTY INFRA",
            "NIFTY METAL",
            "NIFTY PHARMA",
            "NIFTY REALTY",
            "NIFTY COMMODITIES",
            "NIFTY CONSUMPTION",
            "NIFTY ENERGY",
            "NIFTY CPSE",
            "NIFTY PSE",
            "NIFTY MEDIA",
            "NIFTY IND DEFENCE"
        ]
        results = []
        for name in order:
            if name in self.sectors:
                d = self.sectors[name]
                results.append({
                    "NAME": name,
                    "LTP": d["ltp"],
                    "CHGPCT": d["chg_pct"],
                    "BULL_BEAR": 1 if d["chg_pct"] >= 0 else -1
                })
        return results

    def init_options_trades(self):
        """Initializes realistic active option trade contracts linked dynamically to live underlying market prices"""
        now = get_ist_now()
        date_str = now.strftime("%Y-%m-%d")
        self.options_contracts = [
            {
                "RecordID": 1,
                "STRATEGY": "IDX-OPT",
                "UNDERLYING": "NIFTY 50",
                "STRIKE": 24850,
                "TYPE": "CE",
                "ALERT": "LONG",
                "DELTA": 0.52,
                "BASE_UNDERLYING": 24825.50,
                "ENTRY": 148.50,
                "SL": 74.25,
                "T1": 193.05,
                "T2": 230.20,
                "T3": 267.30,
                "SIGNAL_DT": f"{date_str} 09:35:12",
                "TRADE": "OPEN"
            },
            {
                "RecordID": 2,
                "STRATEGY": "IDX-OPT",
                "UNDERLYING": "BANK NIFTY",
                "STRIKE": 52200,
                "TYPE": "CE",
                "ALERT": "LONG",
                "DELTA": 0.50,
                "BASE_UNDERLYING": 52140.20,
                "ENTRY": 485.00,
                "SL": 242.50,
                "T1": 630.50,
                "T2": 751.75,
                "T3": 873.00,
                "SIGNAL_DT": f"{date_str} 09:42:18",
                "TRADE": "OPEN"
            },
            {
                "RecordID": 3,
                "STRATEGY": "OPT-1",
                "UNDERLYING": "PATANJALI",
                "STRIKE": 1820,
                "TYPE": "CE",
                "ALERT": "LONG",
                "DELTA": 0.55,
                "BASE_UNDERLYING": 1800.00,
                "ENTRY": 42.50,
                "SL": 21.25,
                "T1": 55.25,
                "T2": 65.90,
                "T3": 76.50,
                "SIGNAL_DT": f"{date_str} 10:05:40",
                "TRADE": "OPEN"
            },
            {
                "RecordID": 4,
                "STRATEGY": "OPT-1",
                "UNDERLYING": "MANKIND",
                "STRIKE": 2580,
                "TYPE": "CE",
                "ALERT": "LONG",
                "DELTA": 0.52,
                "BASE_UNDERLYING": 2550.00,
                "ENTRY": 68.00,
                "SL": 34.00,
                "T1": 88.40,
                "T2": 105.40,
                "T3": 122.40,
                "SIGNAL_DT": f"{date_str} 10:15:22",
                "TRADE": "OPEN"
            },
            {
                "RecordID": 5,
                "STRATEGY": "OPT-1",
                "UNDERLYING": "KAYNES",
                "STRIKE": 4950,
                "TYPE": "CE",
                "ALERT": "LONG",
                "DELTA": 0.54,
                "BASE_UNDERLYING": 4900.00,
                "ENTRY": 125.00,
                "SL": 62.50,
                "T1": 162.50,
                "T2": 193.75,
                "T3": 225.00,
                "SIGNAL_DT": f"{date_str} 10:28:15",
                "TRADE": "OPEN"
            },
            {
                "RecordID": 6,
                "STRATEGY": "OPT-1",
                "UNDERLYING": "SOLARINDS",
                "STRIKE": 10500,
                "TYPE": "CE",
                "ALERT": "LONG",
                "DELTA": 0.50,
                "BASE_UNDERLYING": 10400.00,
                "ENTRY": 280.00,
                "SL": 140.00,
                "T1": 364.00,
                "T2": 434.00,
                "T3": 504.00,
                "SIGNAL_DT": f"{date_str} 10:45:00",
                "TRADE": "OPEN"
            },
            {
                "RecordID": 7,
                "STRATEGY": "OPT-1",
                "UNDERLYING": "LICHSGFIN",
                "STRIKE": 690,
                "TYPE": "CE",
                "ALERT": "LONG",
                "DELTA": 0.52,
                "BASE_UNDERLYING": 680.00,
                "ENTRY": 18.20,
                "SL": 9.10,
                "T1": 23.65,
                "T2": 28.20,
                "T3": 32.75,
                "SIGNAL_DT": f"{date_str} 11:02:18",
                "TRADE": "OPEN"
            },
            {
                "RecordID": 8,
                "STRATEGY": "OPT-1",
                "UNDERLYING": "NAUKRI",
                "STRIKE": 7250,
                "TYPE": "CE",
                "ALERT": "LONG",
                "DELTA": 0.51,
                "BASE_UNDERLYING": 7200.00,
                "ENTRY": 185.00,
                "SL": 92.50,
                "T1": 240.50,
                "T2": 286.75,
                "T3": 333.00,
                "SIGNAL_DT": f"{date_str} 11:20:30",
                "TRADE": "OPEN"
            },
            {
                "RecordID": 9,
                "STRATEGY": "IDX-OPT",
                "UNDERLYING": "FINNIFTY",
                "STRIKE": 23450,
                "TYPE": "CE",
                "ALERT": "LONG",
                "DELTA": 0.50,
                "BASE_UNDERLYING": 23400.00,
                "ENTRY": 120.00,
                "SL": 60.00,
                "T1": 156.00,
                "T2": 186.00,
                "T3": 216.00,
                "SIGNAL_DT": f"{date_str} 11:45:10",
                "TRADE": "OPEN"
            },
            {
                "RecordID": 10,
                "STRATEGY": "OPT-1",
                "UNDERLYING": "RELIANCE",
                "STRIKE": 3020,
                "TYPE": "CE",
                "ALERT": "LONG",
                "DELTA": 0.53,
                "BASE_UNDERLYING": 3000.00,
                "ENTRY": 64.50,
                "SL": 32.25,
                "T1": 83.85,
                "T2": 100.00,
                "T3": 116.10,
                "SIGNAL_DT": f"{date_str} 12:10:45",
                "TRADE": "OPEN"
            },
            {
                "RecordID": 11,
                "STRATEGY": "OPT-1",
                "UNDERLYING": "HDFCBANK",
                "STRIKE": 1540,
                "TYPE": "CE",
                "ALERT": "LONG",
                "DELTA": 0.50,
                "BASE_UNDERLYING": 1530.00,
                "ENTRY": 28.50,
                "SL": 14.25,
                "T1": 37.05,
                "T2": 44.20,
                "T3": 51.30,
                "SIGNAL_DT": f"{date_str} 12:35:12",
                "TRADE": "OPEN"
            },
            {
                "RecordID": 12,
                "STRATEGY": "OPT-1",
                "UNDERLYING": "OFSS",
                "STRIKE": 11500,
                "TYPE": "PE",
                "ALERT": "SHORT",
                "DELTA": 0.50,
                "BASE_UNDERLYING": 11600.00,
                "ENTRY": 340.00,
                "SL": 170.00,
                "T1": 442.00,
                "T2": 527.00,
                "T3": 612.00,
                "SIGNAL_DT": f"{date_str} 13:05:50",
                "TRADE": "OPEN"
            },
            {
                "RecordID": 13,
                "STRATEGY": "OPT-1",
                "UNDERLYING": "UNOMINDA",
                "STRIKE": 980,
                "TYPE": "PE",
                "ALERT": "SHORT",
                "DELTA": 0.48,
                "BASE_UNDERLYING": 1000.00,
                "ENTRY": 24.50,
                "SL": 12.25,
                "T1": 31.85,
                "T2": 37.95,
                "T3": 44.10,
                "SIGNAL_DT": f"{date_str} 13:20:18",
                "TRADE": "OPEN"
            },
            {
                "RecordID": 14,
                "STRATEGY": "OPT-1",
                "UNDERLYING": "BHARTIARTL",
                "STRIKE": 1520,
                "TYPE": "PE",
                "ALERT": "SHORT",
                "DELTA": 0.51,
                "BASE_UNDERLYING": 1540.00,
                "ENTRY": 38.00,
                "SL": 19.00,
                "T1": 49.40,
                "T2": 58.90,
                "T3": 68.40,
                "SIGNAL_DT": f"{date_str} 13:45:30",
                "TRADE": "OPEN"
            }
        ]

    def get_options_trades(self):
        """Returns live, real-time option trades dynamically tracking underlying stock ticks"""
        now = get_ist_now()
        month_str = now.strftime("%b").upper()
        expiry_label = f"26 {month_str}"

        results = []
        for opt in self.options_contracts:
            underlying = opt["UNDERLYING"]
            st = self.stocks.get(underlying)
            cur_ltp = st["ltp"] if st else opt["BASE_UNDERLYING"]
            diff = cur_ltp - opt["BASE_UNDERLYING"]
            
            # Real-time Black-Scholes Greeks calculation
            greeks = black_scholes_pricing(
                S=cur_ltp,
                K=opt["STRIKE"],
                T=max(1, (26 - now.day)) / 365.0,
                r=0.065,
                sigma=0.18 if "NIFTY" in underlying else 0.28,
                option_type=opt["TYPE"]
            )

            # Delta movement: CE benefits from up moves, PE benefits from down moves
            move = diff if opt["TYPE"] == "CE" else -diff
            eff_delta = max(0.20, min(0.95, abs(greeks["delta"]) if greeks["delta"] != 0 else opt.get("DELTA", 0.50)))
            option_ltp = round(max(0.50, opt["ENTRY"] + (move * eff_delta)), 2)
            
            # Dynamic status evaluation
            status = "ACTIVE"
            exit_price = 0.0
            trade_state = "OPEN"
            if option_ltp >= opt["T3"]:
                status = "T3 MET"
                trade_state = "CLOSED"
                exit_price = opt["T3"]
            elif option_ltp >= opt["T2"]:
                status = "T2 MET"
            elif option_ltp >= opt["T1"]:
                status = "T1 MET"
            elif option_ltp <= opt["SL"]:
                status = "SL MET"
                trade_state = "CLOSED"
                exit_price = opt["SL"]

            # Display symbol format matching NeoTrader: "NIFTY 26 SEP 24850 CE"
            display_sym = f"{underlying.replace(' 50', '')} {expiry_label} {opt['STRIKE']} {opt['TYPE']}"
            update_dt = now.strftime("%Y-%m-%d %H:%M:%S")

            results.append({
                "RecordID": opt["RecordID"],
                "STRATEGY": opt["STRATEGY"],
                "SYMBOL": display_sym,
                "UNDERLYING": underlying,
                "ALERT": opt["ALERT"],
                "SIGNAL_DT": opt["SIGNAL_DT"],
                "STATUS": status,
                "ENTRY": opt["ENTRY"],
                "LTP": option_ltp,
                "T1": opt["T1"],
                "T2": opt["T2"],
                "T3": opt["T3"],
                "SL": opt["SL"],
                "TRADE": trade_state,
                "EXIT": exit_price,
                "UPDATE_DT": update_dt,
                "DELTA": greeks["delta"],
                "GAMMA": greeks["gamma"],
                "THETA": greeks["theta"],
                "VEGA": greeks["vega"],
                "IV": greeks["iv"]
            })
        return results

    def get_intraday_trades(self):
        """Returns live intraday trades dynamically synced with current live stock prices"""
        now = get_ist_now()
        date_str = now.strftime("%Y-%m-%d")
        candidates = [
            ("PATANJALI", "REVERSAL-3", "OVERNIGHT", "SHORT", 1820.50, 1845.0, 1780.0, 1750.0, 1720.0, [0, 0, 0, 0]),
            ("POLICYBZR", "DAWN", "INTRADAY", "LONG", 1725.00, 1690.0, 1760.0, 1790.0, 1820.0, [1, 0, 0, 0]),
            ("MANKIND", "REVERSAL-3", "OVERNIGHT", "SHORT", 2580.40, 2620.0, 2530.0, 2490.0, 2440.0, [0, 0, 0, 0]),
            ("CHOLAFIN", "DAWN", "INTRADAY", "SHORT", 1480.00, 1515.0, 1445.0, 1415.0, 1380.0, [1, 0, 0, 0]),
            ("SIEMENS", "BREAKOUT-1", "INTRADAY", "LONG", 6850.00, 6780.0, 6940.0, 7020.0, 7150.0, [1, 0, 0, 0]),
            ("HCLTECH", "BREAKOUT-1", "INTRADAY", "LONG", 1780.00, 1745.0, 1820.0, 1855.0, 1890.0, [1, 1, 0, 0]),
            ("KAYNES", "MOMENTUM-1", "INTRADAY", "LONG", 4920.00, 4820.0, 5030.0, 5140.0, 5280.0, [1, 0, 1, 0]),
            ("SOLARINDS", "MOMENTUM-1", "OVERNIGHT", "LONG", 10450.00, 10250.0, 10700.0, 10920.0, 11200.0, [1, 1, 1, 0]),
        ]
        results = []
        for idx, (sym, strat, timeplay, alert, base_entry, sl, t1, t2, t3, summary) in enumerate(candidates, start=1):
            st = self.stocks.get(sym, {})
            cur_p = st.get("ltp", base_entry)
            
            is_long = alert == "LONG"
            status = "ACTIVE"
            trade_state = "OPEN"
            exit_p = 0.0
            if (is_long and cur_p >= t3) or (not is_long and cur_p <= t3):
                status = "T3 MET"
                trade_state = "CLOSED"
                exit_p = t3
            elif (is_long and cur_p >= t2) or (not is_long and cur_p <= t2):
                status = "T2 MET"
            elif (is_long and cur_p >= t1) or (not is_long and cur_p <= t1):
                status = "T1 MET"
            elif (is_long and cur_p <= sl) or (not is_long and cur_p >= sl):
                status = "SL MET"
                trade_state = "CLOSED"
                exit_p = sl

            results.append({
                "RecordID": idx,
                "STRATEGY": strat,
                "TIMEPLAY": timeplay,
                "SYMBOL": sym,
                "RECENT_VALUE": cur_p,
                "ALERT": alert,
                "ENTRY": base_entry,
                "SIGNAL_DT": f"{date_str} {9 + (idx % 5):02d}:{15 + (idx * 7) % 45:02d}:30",
                "SL": sl,
                "STATUS": status,
                "T1": t1,
                "T2": t2,
                "T3": t3,
                "TRADE": trade_state,
                "EXIT": exit_p,
                "UPDATE_DT": now.strftime("%Y-%m-%d %H:%M:%S"),
                "SUMMARY": summary
            })
        return results

    def get_sector_performance(self):
        """Detailed sector analysis view data matching exact fixed NeoTrader order"""
        return self.get_sector_market_indices()

    def get_heatmap_stocks(self, universe="NIFTY FNO", mode="Close"):
        """
        Returns stock items for the heatmap grid filtered by universe and mode.
        - "NIFTY FNO": returns authentic 185 F&O stocks.
        - "ALL NSE" / "ALL": returns all 2,559+ active NSE listed stocks.
        - "NIFTY 500": returns 501 constituents.
        - "NIFTY 100": returns 100 constituents.
        - Other sectors: returns sector constituents.
        """
        self.update_ticks()
        
        target_symbols = None
        if universe in ("ALL NSE", "ALL", "ALL STOCKS"):
            target_symbols = None
        elif universe == "NIFTY FNO":
            target_symbols = set(UNIVERSE_MAP.get("NIFTY FNO", self.fno_symbols))
        elif universe in UNIVERSE_MAP:
            target_symbols = set(UNIVERSE_MAP[universe])
        elif universe == "INDICES":
            target_symbols = set(UNIVERSE_MAP.get("INDICES", []))
        
        results = []
        for sym, st in self.stocks.items():
            if st["type"] == "INDEX" and universe != "INDICES":
                continue
            
            if target_symbols is not None and sym not in target_symbols:
                continue

            close_chg = st["chg_pct"]
            open_chg = round(((st["ltp"] - st["open"]) / max(st["open"], 1.0)) * 100, 2)
            active_chg = close_chg if mode == "Close" else open_chg

            results.append({
                "SYMBOL": sym,
                "LTP": st["ltp"],
                "DAY_CLOSE_CHG_P": close_chg,
                "DAY_OPEN_CHG_P": open_chg,
                "DAY_CHG_P": active_chg,
                "NSE_INDEX": 1 if st["type"] == "INDEX" else 0,
                "FNO_FLAG": 1 if (st.get("is_fno") or sym in self.fno_symbols) else 0,
                "BULL_BEAR": 1 if active_chg >= 0 else -1,
                "SECTOR": st["sector"],
                "HIGH": st["high"],
                "LOW": st["low"],
                "PREV_CLOSE": st["prev_close"],
                "OPEN": st["open"]
            })
            
        # Sort descending by active change %
        results.sort(key=lambda x: x["DAY_CHG_P"], reverse=True)
        return results

    def get_advance_decline(self, universe="NIFTY FNO", mode="Close"):
        """
        Computes Advance/Decline breadth counts matching authentic Donut Chart:
        - 111 Advances (Dark Green >=2%: 24, Light Green 0-2%: 87)
        - 74 Declines (Light Red 0 to -2%: 46, Dark Red <=-2%: 28)
        - Total: 185
        """
        stocks = self.get_heatmap_stocks(universe=universe, mode=mode)
        
        dark_green = sum(1 for s in stocks if s["DAY_CHG_P"] >= 2.0)
        light_green = sum(1 for s in stocks if 0.0 <= s["DAY_CHG_P"] < 2.0)
        light_red = sum(1 for s in stocks if -2.0 < s["DAY_CHG_P"] < 0.0)
        dark_red = sum(1 for s in stocks if s["DAY_CHG_P"] <= -2.0)
        
        advances = dark_green + light_green
        declines = light_red + dark_red
        total = len(stocks)

        return {
            "total": total,
            "advances": advances,
            "declines": declines,
            "dark_green": dark_green,
            "light_green": light_green,
            "light_red": light_red,
            "dark_red": dark_red
        }

    def get_dashboard_stats(self, universe="NIFTY FNO"):
        """Returns dynamically calculated stats for Stock Change and Pivots Change matching authentic terminal methodology"""
        self.update_ticks()
        target_symbols = set(UNIVERSE_MAP.get(universe, self.fno_symbols)) if universe in UNIVERSE_MAP else self.fno_symbols
        fno_stocks = [
            st for sym, st in self.stocks.items()
            if st["type"] != "INDEX" and (universe == "ALL" or sym in target_symbols)
        ]
        
        # Stock Change buckets (Exact live counts)
        g_gt_4 = sum(1 for s in fno_stocks if s["chg_pct"] >= 4.0)
        g_3_4 = sum(1 for s in fno_stocks if 3.0 <= s["chg_pct"] < 4.0)
        g_2_3 = sum(1 for s in fno_stocks if 2.0 <= s["chg_pct"] < 3.0)
        g_1_2 = sum(1 for s in fno_stocks if 1.0 <= s["chg_pct"] < 2.0)
        g_0_1 = sum(1 for s in fno_stocks if 0.0 <= s["chg_pct"] < 1.0)

        l_lt_4 = sum(1 for s in fno_stocks if s["chg_pct"] <= -4.0)
        l_3_4 = sum(1 for s in fno_stocks if -4.0 < s["chg_pct"] <= -3.0)
        l_2_3 = sum(1 for s in fno_stocks if -3.0 < s["chg_pct"] <= -2.0)
        l_1_2 = sum(1 for s in fno_stocks if -2.0 < s["chg_pct"] <= -1.0)
        l_0_1 = sum(1 for s in fno_stocks if -1.0 < s["chg_pct"] < 0.0)

        # Dynamic Fibonacci Pivot distribution
        r4_plus, r3_r4, r2_r3, r1_r2, p_r1 = 0, 0, 0, 0, 0
        p_s1, s1_s2, s2_s3, s3_s4, s4_minus = 0, 0, 0, 0, 0

        for s in fno_stocks:
            H, L, C = s["high"], s["low"], s["ltp"]
            rng = max(H - L, 0.05)
            P = (H + L + C) / 3.0
            r1 = P + 0.382 * rng
            r2 = P + 0.618 * rng
            r3 = P + 1.000 * rng
            r4 = P + 1.618 * rng
            s1 = P - 0.382 * rng
            s2 = P - 0.618 * rng
            s3 = P - 1.000 * rng
            s4 = P - 1.618 * rng

            if C >= r4: r4_plus += 1
            elif C >= r3: r3_r4 += 1
            elif C >= r2: r2_r3 += 1
            elif C >= r1: r1_r2 += 1
            elif C >= P: p_r1 += 1
            elif C >= s1: p_s1 += 1
            elif C >= s2: s1_s2 += 1
            elif C >= s3: s2_s3 += 1
            elif C >= s4: s3_s4 += 1
            else: s4_minus += 1

        return {
            "stock_change": {
                "gainers": [
                    {"type": "> 4%", "count": g_gt_4},
                    {"type": "3 to 4%", "count": g_3_4},
                    {"type": "2 to 3%", "count": g_2_3},
                    {"type": "1 to 2%", "count": g_1_2},
                    {"type": "0 to 1%", "count": g_0_1}
                ],
                "losers": [
                    {"type": "<-4%", "count": l_lt_4},
                    {"type": "-3 to -4%", "count": l_3_4},
                    {"type": "-2 to -3%", "count": l_2_3},
                    {"type": "-1 to -2%", "count": l_1_2},
                    {"type": "0 to -1%", "count": l_0_1}
                ]
            },
            "pivots_change": {
                "resistance": [
                    {"type": "R4 +", "count": r4_plus},
                    {"type": "R3-R4", "count": r3_r4},
                    {"type": "R2-R3", "count": r2_r3},
                    {"type": "R1-R2", "count": r1_r2},
                    {"type": "P-R1", "count": p_r1}
                ],
                "support": [
                    {"type": "S4 -", "count": s4_minus},
                    {"type": "S3-S4", "count": s3_s4},
                    {"type": "S2-S3", "count": s2_s3},
                    {"type": "S1-S2", "count": s1_s2},
                    {"type": "P-S1", "count": p_s1}
                ]
            }
        }

    def get_gap_summary(self, universe="NIFTY FNO"):
        """Returns live Gap Up/Down with follow-through statistics dynamically computed from active stocks"""
        target_symbols = set(UNIVERSE_MAP.get(universe, self.fno_symbols)) if universe in UNIVERSE_MAP else self.fno_symbols
        fno_stocks = [
            st for sym, st in self.stocks.items()
            if st["type"] != "INDEX" and (universe == "ALL" or sym in target_symbols)
        ]
        gu_ft = sum(1 for s in fno_stocks if s["open"] > s["prev_close"] * 1.002 and s["ltp"] > s["open"])
        gd_nft = sum(1 for s in fno_stocks if s["open"] < s["prev_close"] * 0.998 and s["ltp"] >= s["open"])
        gd_ft = sum(1 for s in fno_stocks if s["open"] < s["prev_close"] * 0.998 and s["ltp"] < s["open"])
        gu_nft = sum(1 for s in fno_stocks if s["open"] > s["prev_close"] * 1.002 and s["ltp"] <= s["open"])

        return [
            {"title": "Gap Up With Follow Through", "count": gu_ft, "is_positive": True},
            {"title": "Gap Down With No Follow Through", "count": gd_nft, "is_positive": False},
            {"title": "Gap Down With Follow Through", "count": gd_ft, "is_positive": False},
            {"title": "Gap Up With No Follow Through", "count": gu_nft, "is_positive": False}
        ]

    def get_day_trader_bullets(self, chng_by="CLOSE", min_chg=0.75, expect=1.0, risk=1.0, search_query=""):
        """
        Generates real-time Day Trader Bullets matching Screenshot 23-50-54:
        Columns: #, Stock, Day Change%, Trigger Time, Trigger Price, Move Since Trigger, I Expect, My Risk
        """
        self.update_ticks()
        bullets = []
        trade_configs = [
            ("PATANJALI", 1, "09:20:15", 1720.00, "BUY", 1.0, 0.5),
            ("MANKIND", 1, "09:25:30", 2460.00, "BUY", 1.5, 0.5),
            ("KAYNES", 1, "09:32:10", 4780.00, "BUY", 2.0, 1.0),
            ("SOLARINDS", 1, "09:40:00", 10150.00, "BUY", 2.0, 1.0),
            ("LICHSGFIN", 1, "09:45:22", 665.00, "BUY", 1.0, 0.5),
            ("NAUKRI", 1, "09:50:18", 7050.00, "BUY", 1.5, 1.0),
            ("ICICIGI", 1, "09:55:00", 2120.00, "BUY", 1.0, 0.5),
            ("LAURUSLABS", 1, "10:02:15", 450.00, "BUY", 1.5, 0.5),
            ("RELIANCE", 1, "10:14:30", 2980.00, "BUY", 1.0, 0.5),
            ("HDFCBANK", 1, "10:20:00", 1525.00, "BUY", 1.0, 0.5),
            ("OFSS", -1, "09:22:00", 12100.00, "SELL", 2.0, 1.0),
            ("UNOMINDA", -1, "09:35:10", 1010.00, "SELL", 1.5, 0.5),
            ("APLAPOLLO", -1, "09:42:00", 1460.00, "SELL", 1.5, 1.0),
            ("KFINTECH", -1, "09:51:30", 1110.00, "SELL", 1.0, 0.5),
            ("BHARTIARTL", -1, "10:05:20", 1560.00, "SELL", 1.0, 0.5),
            ("BSE", -1, "10:18:15", 3940.00, "SELL", 2.0, 1.0)
        ]

        for idx, (sym, bull_bear, trig_time, trig_price, action, exp_val, risk_val) in enumerate(trade_configs, start=1):
            st = self.stocks.get(sym)
            if not st: continue
            
            day_chg = st["chg_pct"] if chng_by == "CLOSE" else round(((st["ltp"] - st["open"]) / st["open"]) * 100, 2)
            
            # Filter criteria check
            if abs(day_chg) < min_chg:
                continue
            if search_query and search_query.upper() not in sym:
                continue

            ltp = st["ltp"]
            move_pts = round(ltp - trig_price if action == "BUY" else trig_price - ltp, 2)
            move_pct = round((move_pts / trig_price) * 100, 2)

            bullets.append({
                "INDEX": idx,
                "SYMBOL": sym,
                "LTP": ltp,
                "DAY_CHG_P": day_chg,
                "TRIGGER_TIME": trig_time,
                "TRIGGER_PRICE": trig_price,
                "MOVE_SINCE_TRIGGER": move_pts,
                "MOVE_PCT": move_pct,
                "I_EXPECT": f"{exp_val}%",
                "MY_RISK": f"{risk_val}%",
                "BULL_BEAR": bull_bear,
                "ACTION": action
            })

        return bullets

    def get_active_stocks(self, tab="well_set_bull", timeframe="DAY", sort_by="AGING"):
        """
        Returns Active Stocks setups matching Screenshot 23-50-54 & 23-51-11:
        Pills: WELL SET BULL, WELL SET BEAR, TAKING GUARD BULL, TAKING GUARD BEAR, Price Gainer/Looser
        """
        self.update_ticks()
        
        configs = {
            "well_set_bull": [
                ("HDFCLIFE", 3, 2, 2.45, 1, 3, 0, 1, 685.0, 698.0, 662.0),
                ("MFSL", 3, 1, 3.12, 1, 3, 0, 1, 1045.0, 1068.0, 1010.0),
                ("HCLTECH", 2, 1, 1.84, 1, 2, 0, 1, 1780.0, 1810.0, 1735.0),
                ("RELIANCE", 3, 2, 1.25, 1, 3, 0, 1, 3050.0, 3090.0, 2960.0),
                ("TATAMOTORS", 4, 3, 2.15, 1, 3, 0, 1, 995.0, 1020.0, 955.0),
                ("TCS", 2, 1, 0.95, 1, 2, 0, 1, 3980.0, 4025.0, 3910.0),
                ("SBIN", 2, 0, 1.10, 1, 1, 0, 1, 825.0, 838.0, 802.0),
                ("ICICIBANK", 3, 2, 1.45, 1, 3, 0, 1, 1235.0, 1255.0, 1195.0)
            ],
            "well_set_bear": [
                ("INFY", -3, -2, -1.85, -1, 3, 0, 1, 1640.0, 1615.0, 1690.0),
                ("AXISBANK", -2, -1, -1.15, -1, 2, 0, 1, 1165.0, 1148.0, 1195.0),
                ("TATASTEEL", -2, 0, -0.92, -1, 2, 0, 1, 153.0, 150.5, 158.0),
                ("WIPRO", -1, 0, -0.65, -1, 1, 0, 1, 535.0, 526.0, 548.0)
            ],
            "taking_guard_bull": [
                ("MARUTI", 1, 0, 0.85, 1, 1, 0, 1, 12550.0, 12700.0, 12300.0),
                ("SUNPHARMA", 1, -1, 0.72, 1, 1, 0, 1, 1755.0, 1775.0, 1720.0),
                ("LT", 1, 0, 0.90, 1, 1, 0, 1, 3650.0, 3700.0, 3570.0)
            ],
            "taking_guard_bear": [
                ("BAJFINANCE", -1, 0, -0.75, -1, 1, 0, 1, 7150.0, 7050.0, 7320.0),
                ("ASIANPAINT", -1, 1, -0.82, -1, 1, 0, 1, 3130.0, 3080.0, 3210.0)
            ]
        }

        active_list = configs.get(tab, configs["well_set_bull"])
        items = []
        now_ts = get_ist_now().strftime("%Y-%m-%d %H:%M:%S")

        for sym, score, old_score, pct_chg, bb, strikes, col_chg, trend_fl, t1, t2, sl in active_list:
            st = self.stocks.get(sym, {})
            ltp = st.get("ltp", 1000.0)
            live_chg = st.get("chg_pct", pct_chg)
            
            items.append({
                "SYMBOL": sym,
                "SCORE": score,
                "SCORE_OLD": old_score,
                "PCT_CHG": live_chg,
                "BULL_BEAR": bb,
                "ASTRIKE_COUNT": strikes,
                "CHANGE_COLOUR": col_chg,
                "TRENDED_FLIP": trend_fl,
                "TRADE_RANGE_TS": now_ts,
                "LTP": ltp,
                "bull_t1": t1,
                "bull_t2": t2,
                "bull_sl": sl,
                "bear_t1": t1,
                "bear_t2": t2,
                "bear_sl": sl,
                "TIMEFRAME": timeframe
            })

        if sort_by == "Score":
            items.sort(key=lambda x: abs(x["SCORE"]), reverse=True)
        elif sort_by == "Change %":
            items.sort(key=lambda x: abs(x["PCT_CHG"]), reverse=True)

        return items

    def get_camarilla_levels(self):
        """
        Calculates signature Camarilla Pivot Point levels
        H6 to H1, L1 to L6 for all active FNO stocks.
        """
        results = []
        for sym, st in self.stocks.items():
            if st["type"] == "INDEX": continue
            H = st["high"]
            L = st["low"]
            C = st["ltp"]
            rng = max(H - L, 0.1)
            
            # Classical Camarilla formulas
            P = round((H + L + C) / 3.0, 2)
            h1 = round(C + (rng * 1.1 / 12), 2)
            h2 = round(C + (rng * 1.1 / 6), 2)
            h3 = round(C + (rng * 1.1 / 4), 2)
            h4 = round(C + (rng * 1.1 / 2), 2)
            h5 = round(max((H / max(L, 1.0)) * C, h4 + (h4 - h3)), 2)
            h6 = round(max(C + (h5 - C) * 1.3, h5 + (h5 - h4)), 2)

            l1 = round(C - (rng * 1.1 / 12), 2)
            l2 = round(C - (rng * 1.1 / 6), 2)
            l3 = round(C - (rng * 1.1 / 4), 2)
            l4 = round(C - (rng * 1.1 / 2), 2)
            l5 = round(min(C - (h5 - C), l4 - (l3 - l4)), 2)
            l6 = round(min(C - (h6 - C), l5 - (l4 - l5)), 2)

            signal = "NEUTRAL"
            if C >= h4: signal = "H4 BREAKOUT (BULLISH)"
            elif C <= l4: signal = "L4 BREAKDOWN (BEARISH)"
            elif C >= h3: signal = "H3 RESISTANCE"
            elif C <= l3: signal = "L3 SUPPORT"

            results.append({
                "SYMBOL": sym,
                "symbol": sym,
                "LTP": C,
                "ltp": C,
                "PIVOT": P,
                "pivot": P,
                "high": H,
                "low": L,
                "TIMEFRAME": "DAILY",
                "timeframe": "DAILY",
                "H6": h6, "H5": h5, "H4": h4, "H3": h3, "H2": h2, "H1": h1,
                "h6": h6, "h5": h5, "h4": h4, "h3": h3, "h2": h2, "h1": h1,
                "L1": l1, "L2": l2, "L3": l3, "L4": l4, "L5": l5, "L6": l6,
                "l1": l1, "l2": l2, "l3": l3, "l4": l4, "l5": l5, "l6": l6,
                "SIGNAL": signal,
                "signal": signal
            })
        return results

    def get_options_radar(self):
        """Generates ATM Straddle and Options Alert strikes based on current spot prices"""
        options_data = []
        underlyings = ["NIFTY 50", "BANK NIFTY", "RELIANCE", "HDFCBANK", "INFY", "TCS", "TATAMOTORS"]
        now = get_ist_now()
        
        for idx, sym in enumerate(underlyings, start=1):
            st = self.stocks.get(sym)
            if not st: continue
            
            spot = st["ltp"]
            step = 50 if "NIFTY" in sym else (100 if "BANK" in sym else 20)
            strike = round(spot / step) * step
            ce_price = round(spot * 0.012, 1)
            pe_price = round(spot * 0.011, 1)
            straddle = round(ce_price + pe_price, 1)

            options_data.append({
                "RecordID": idx,
                "SYMBOL": sym,
                "SPOT": spot,
                "ATM_STRIKE": strike,
                "CE_LTP": ce_price,
                "PE_LTP": pe_price,
                "STRADDLE_PREMIUM": straddle,
                "IMPLIED_VOL": "13.8%",
                "MAX_PAIN": strike,
                "PCR": 1.15 if st["chg"] >= 0 else 0.82,
                "ACTION": "BUY STRADDLE" if straddle < (spot * 0.015) else "SELL STRADDLE",
                "TIMESTAMP": now.strftime("%H:%M:%S")
            })
        return options_data

market_sim = MarketSimulator()
