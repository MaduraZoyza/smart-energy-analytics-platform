import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


# -----------------------------------
# SQL GENERATOR
# -----------------------------------
def generate_sql(question: str) -> str:
    prompt = f"""
You are a PostgreSQL expert.

Convert the user question into ONE PostgreSQL SELECT query.

Database schema:

energy_readings(
    id,
    timestamp,
    building,
    floor_area,
    category,
    meter_id,
    energy_kwh,
    avg_power_kw,
    occupancy_level,
    outside_temp_c,
    is_weekend,
    notes
)

IMPORTANT:

floor_area contains:
- Floor 1
- Floor 2
- Floor 3
- Common Areas

category contains:
- HVAC
- Lighting
- Plug Loads
- Server Room
- Elevators
- Fire System
- Outdoor Lighting

Use floor_area for floor questions.
Use category for HVAC, Lighting, Plug Loads etc.
Return ONLY SQL.

Question:
{question}
"""

    res = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    sql = res.text.replace("```sql", "").replace("```", "").strip()
    return sql


# -----------------------------------
# SQL FIXER
# -----------------------------------
def fix_sql(question: str, bad_sql: str, error: str) -> str:
    prompt = f"""
You are a PostgreSQL expert.

The previous SQL query failed.

Fix it.

RULES:
- Return ONLY corrected SQL
- Must be SELECT only

Question:
{question}

Bad SQL:
{bad_sql}

Error:
{error}
"""

    res = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    sql = res.text.replace("```sql", "").replace("```", "").strip()
    return sql


# -----------------------------------
# EXPLAIN RESULT
# -----------------------------------
def explain_result(question: str, result) -> str:
    prompt = f"""
You are a data analyst.

Explain the result in simple English.

Question: {question}
Result: {result}

Give a short human-friendly answer.
"""

    res = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return res.text.strip()