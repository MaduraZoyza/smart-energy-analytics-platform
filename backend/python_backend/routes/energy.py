from fastapi import APIRouter
import psycopg2.extras
from db import get_db

router = APIRouter()


@router.get("/energy")
def get_all_energy():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM energy_readings ORDER BY timestamp LIMIT 100")
    rows = cur.fetchall()
    conn.close()
    return list(rows)


@router.get("/energy/daily")
def get_daily():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT DATE(timestamp) as date, SUM(energy_kwh) as total_kwh
        FROM energy_readings
        GROUP BY DATE(timestamp)
        ORDER BY date
    """)
    rows = cur.fetchall()
    conn.close()
    return list(rows)


@router.get("/energy/hourly")
def get_hourly():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT EXTRACT(HOUR FROM timestamp)::int as hour,
               ROUND(AVG(energy_kwh)::numeric, 2) as avg_kwh,
               ROUND(SUM(energy_kwh)::numeric, 2) as total_kwh
        FROM energy_readings
        GROUP BY EXTRACT(HOUR FROM timestamp)
        ORDER BY hour
    """)
    rows = cur.fetchall()
    conn.close()
    return list(rows)


@router.get("/energy/weekly")
def get_weekly():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT DATE_TRUNC('week', timestamp)::date as week_start,
               ROUND(SUM(energy_kwh)::numeric, 2) as total_kwh
        FROM energy_readings
        GROUP BY DATE_TRUNC('week', timestamp)
        ORDER BY week_start
    """)
    rows = cur.fetchall()
    conn.close()
    return list(rows)


@router.get("/energy/monthly")
def get_monthly():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT DATE_TRUNC('month', timestamp)::date as month_start,
               ROUND(SUM(energy_kwh)::numeric, 2) as total_kwh
        FROM energy_readings
        GROUP BY DATE_TRUNC('month', timestamp)
        ORDER BY month_start
    """)
    rows = cur.fetchall()
    conn.close()
    return list(rows)
