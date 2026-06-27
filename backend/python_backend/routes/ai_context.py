from fastapi import APIRouter
import psycopg2.extras
from db import get_db

router = APIRouter()


@router.get("/energy/ai-context")
def get_ai_context():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute("""
        SELECT COUNT(*) as total_records,
               ROUND(SUM(energy_kwh)::numeric, 2) as total_kwh,
               ROUND(AVG(energy_kwh)::numeric, 2) as avg_kwh,
               ROUND(MAX(energy_kwh)::numeric, 2) as peak_kwh
        FROM energy_readings
    """)
    summary = dict(cur.fetchone())

    cur.execute("""
        SELECT floor_area, category, ROUND(SUM(energy_kwh)::numeric, 2) as total_kwh
        FROM energy_readings
        GROUP BY floor_area, category
        ORDER BY total_kwh DESC
        LIMIT 5
    """)
    top_consumers = list(cur.fetchall())

    cur.execute("""
        SELECT time_period, ROUND(AVG(energy_kwh)::numeric, 2) as avg_kwh
        FROM energy_readings
        GROUP BY time_period
        ORDER BY avg_kwh DESC
    """)
    time_period_ranking = list(cur.fetchall())

    cur.execute("""
        SELECT is_weekend, ROUND(AVG(energy_kwh)::numeric, 2) as avg_kwh
        FROM energy_readings
        GROUP BY is_weekend
    """)
    weekend_vs_weekday = list(cur.fetchall())

    conn.close()
    return {
        "summary": summary,
        "top_consuming_zones": top_consumers,
        "time_period_ranking": time_period_ranking,
        "weekend_vs_weekday": weekend_vs_weekday
    }
