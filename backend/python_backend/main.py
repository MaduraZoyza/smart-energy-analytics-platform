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
    cur.execute("SELECT floor_area, category, SUM(energy_kwh) as total_kwh FROM energy_readings GROUP BY floor_area, category ORDER BY floor_area, category")
    rows = cur.fetchall()
    conn.close()
    return list(rows)

@app.get("/energy/summary")
def get_summary():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT COUNT(*) as total_records, SUM(energy_kwh) as total_kwh, AVG(energy_kwh) as avg_kwh, MAX(energy_kwh) as peak_kwh FROM energy_readings")
    row = cur.fetchone()
    conn.close()
    return dict(row)

@app.get("/energy/daily")
def get_daily():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT DATE(timestamp) as date, SUM(energy_kwh) as total_kwh FROM energy_readings GROUP BY DATE(timestamp) ORDER BY date")
    rows = cur.fetchall()
    conn.close()
    return list(rows)