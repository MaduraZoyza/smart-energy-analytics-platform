from fastapi import APIRouter
import psycopg2.extras
from db import get_db

router = APIRouter()


@router.get("/energy/summary")
def get_summary():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT COUNT(*) as total_records,
               SUM(energy_kwh) as total_kwh,
               AVG(energy_kwh) as avg_kwh,
               MAX(energy_kwh) as peak_kwh
        FROM energy_readings
    """)
    row = cur.fetchone()
    conn.close()
    return dict(row)


@router.get("/energy/time-periods")
def get_time_periods():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT time_period,
               ROUND(AVG(energy_kwh)::numeric, 2) as avg_kwh,
               ROUND(SUM(energy_kwh)::numeric, 2) as total_kwh,
               COUNT(*) as reading_count
        FROM energy_readings
        GROUP BY time_period
        ORDER BY MIN(timestamp)
    """)
    rows = cur.fetchall()
    conn.close()
    return list(rows)
