from fastapi import APIRouter
import psycopg2.extras
from db import get_db

router = APIRouter()


@router.get("/energy/report")
def get_report():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # 1. Overall summary
    cur.execute("""
        SELECT COUNT(*) as total_records,
               ROUND(SUM(energy_kwh)::numeric, 2) as total_kwh,
               ROUND(AVG(energy_kwh)::numeric, 2) as avg_kwh,
               ROUND(MAX(energy_kwh)::numeric, 2) as peak_kwh
        FROM energy_readings
    """)
    summary = dict(cur.fetchone())

    # 2. Energy by floor and zone breakdown
    cur.execute("""
        SELECT floor_area, category,
               ROUND(SUM(energy_kwh)::numeric, 2) as total_kwh,
               ROUND(AVG(energy_kwh)::numeric, 2) as avg_kwh
        FROM energy_readings
        GROUP BY floor_area, category
        ORDER BY floor_area, category
    """)
    zone_breakdown = list(cur.fetchall())

    # 3. Daily usage for June
    cur.execute("""
        SELECT DATE(timestamp) as date,
               ROUND(SUM(energy_kwh)::numeric, 2) as total_kwh
        FROM energy_readings
        GROUP BY DATE(timestamp)
        ORDER BY date
    """)
    daily_usage = list(cur.fetchall())

    # 4. Time period breakdown
    cur.execute("""
        SELECT time_period,
               ROUND(SUM(energy_kwh)::numeric, 2) as total_kwh,
               ROUND(AVG(energy_kwh)::numeric, 2) as avg_kwh,
               COUNT(*) as reading_count
        FROM energy_readings
        GROUP BY time_period
        ORDER BY MIN(timestamp)
    """)
    time_period_breakdown = list(cur.fetchall())

    # 5. Weekend vs weekday comparison
    cur.execute("""
        SELECT is_weekend,
               ROUND(SUM(energy_kwh)::numeric, 2) as total_kwh,
               ROUND(AVG(energy_kwh)::numeric, 2) as avg_kwh,
               COUNT(*) as reading_count
        FROM energy_readings
        GROUP BY is_weekend
        ORDER BY is_weekend
    """)
    weekend_vs_weekday = list(cur.fetchall())

    conn.close()
    return {
        "summary": summary,
        "zone_breakdown": zone_breakdown,
        "daily_usage": daily_usage,
        "time_period_breakdown": time_period_breakdown,
        "weekend_vs_weekday": weekend_vs_weekday
    }
