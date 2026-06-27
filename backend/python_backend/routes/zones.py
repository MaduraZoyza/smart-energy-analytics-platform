from fastapi import APIRouter
import psycopg2.extras
from db import get_db

router = APIRouter()


@router.get("/energy/zones")
def get_zones():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT floor_area, category, SUM(energy_kwh) as total_kwh
        FROM energy_readings
        GROUP BY floor_area, category
        ORDER BY floor_area, category
    """)
    rows = cur.fetchall()
    conn.close()
    return list(rows)


@router.get("/energy/zones/by-view/{view}")
def get_zones_by_view(view: str):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    if view == "hourly":
        # Average kWh per hour across all readings, per zone
        cur.execute("""
            SELECT floor_area, category,
                   ROUND(AVG(energy_kwh)::numeric, 2) as total_kwh
            FROM energy_readings
            GROUP BY floor_area, category
            ORDER BY floor_area, category
        """)
    elif view == "daily":
        # Average daily total per zone
        cur.execute("""
            SELECT floor_area, category,
                   ROUND(AVG(daily_total)::numeric, 2) as total_kwh
            FROM (
                SELECT floor_area, category,
                       DATE(timestamp) as day,
                       SUM(energy_kwh) as daily_total
                FROM energy_readings
                GROUP BY floor_area, category, DATE(timestamp)
            ) daily
            GROUP BY floor_area, category
            ORDER BY floor_area, category
        """)
    elif view == "weekly":
        # Average weekly total per zone
        cur.execute("""
            SELECT floor_area, category,
                   ROUND(AVG(weekly_total)::numeric, 2) as total_kwh
            FROM (
                SELECT floor_area, category,
                       DATE_TRUNC('week', timestamp) as week,
                       SUM(energy_kwh) as weekly_total
                FROM energy_readings
                GROUP BY floor_area, category, DATE_TRUNC('week', timestamp)
            ) weekly
            GROUP BY floor_area, category
            ORDER BY floor_area, category
        """)
    elif view == "monthly":
        # Total June usage per zone
        cur.execute("""
            SELECT floor_area, category,
                   ROUND(SUM(energy_kwh)::numeric, 2) as total_kwh
            FROM energy_readings
            GROUP BY floor_area, category
            ORDER BY floor_area, category
        """)
    else:
        conn.close()
        return {"error": f"Invalid view '{view}'. Use: hourly, daily, weekly, monthly"}

    rows = cur.fetchall()
    conn.close()
    return list(rows)
