from fastapi import APIRouter
from services.alert_service import generate_alerts
from services.recommendation_service import get_recommendations
from services.gemini_service import generate_sql, fix_sql, explain_result
from db import get_db

router = APIRouter()


# -----------------------------------
# SAFETY CHECK
# -----------------------------------
def is_safe_sql(sql: str):
    sql = sql.lower().strip()
    banned = ["insert", "update", "delete", "drop", "alter", "truncate"]
    return sql.startswith("select") and not any(b in sql for b in banned)


# -----------------------------------
# CHAT ENDPOINT
# -----------------------------------
@router.post("/chat")
async def chat(data: dict):

    from services.gemini_service import generate_sql, fix_sql, explain_result

    question = data.get("message", "")

    # STEP 1: Generate SQL
    sql = generate_sql(question)

    if not is_safe_sql(sql):
        return {"response": "Unsafe SQL detected", "sql": sql}

    conn = get_db()
    cur = conn.cursor()

    # STEP 2: Try executing SQL
    try:
        cur.execute(sql)
        rows = cur.fetchall()

    except Exception as e:
        # STEP 3: Auto-fix SQL
        fixed_sql = fix_sql(question, sql, str(e))

        if not is_safe_sql(fixed_sql):
            cur.close()
            conn.close()
            return {"response": "Unsafe fixed SQL", "sql": fixed_sql}

        try:
            cur.execute(fixed_sql)
            rows = cur.fetchall()
            sql = fixed_sql

        except Exception as e2:
            cur.close()
            conn.close()
            return {
                "response": "Query failed after retry",
                "error": str(e2),
                "sql": fixed_sql
            }

    cur.close()
    conn.close()

    # STEP 4: Explain in English
    explanation = explain_result(question, rows)

    return {
        "question": question,
        "sql": sql,
        "data": rows,
        "response": explanation
    }


# -----------------------------------
# ALERTS ENDPOINT
# -----------------------------------
@router.get("/alerts")
async def get_alerts():

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            timestamp,
            category,
            energy_kwh,
            outside_temp_c,
            occupancy_level,
            is_weekend
        FROM energy_readings
        ORDER BY timestamp DESC
        LIMIT 20
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    return generate_alerts(rows)


# -----------------------------------
# RECOMMENDATIONS ENDPOINT
# -----------------------------------
@router.get("/recommendations")
async def recommendations():
    return await get_recommendations()