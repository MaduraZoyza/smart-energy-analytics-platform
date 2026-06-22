from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Smart Energy Analytics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )


@app.get("/")
def root():
    return {"message": "Smart Energy Analytics API is running"}


@app.get("/energy")
def get_all_energy():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM energy_readings ORDER BY timestamp LIMIT 100")
    rows = cur.fetchall()
    conn.close()
    return list(rows)


@app.get("/energy/zones")
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


@app.get("/energy/summary")
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


@app.get("/energy/daily")
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


@app.get("/energy/hourly")
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


@app.get("/energy/weekly")
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


@app.get("/energy/monthly")
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


@app.get("/energy/time-periods")
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


@app.get("/energy/ai-context")
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


@app.get("/energy/zones/by-view/{view}")
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