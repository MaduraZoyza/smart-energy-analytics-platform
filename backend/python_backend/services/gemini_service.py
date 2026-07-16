import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Central model name — change once here if Google retires/renames it again
MODEL_NAME = "gemini-2.5-flash-lite"


# -----------------------------------
# QUESTION CLASSIFIER
# -----------------------------------
def classify_question(question: str) -> str:
    prompt = f"""
You are a classifier for a Smart Energy system.

Classify the user question into ONE of these two types:

Type A - ENERGY: Questions about energy usage, power consumption, kWh, alerts, readings, categories like HVAC/Lighting/Plug Loads.
Type B - BUILDING: Questions about building layout, rooms, floors, areas, spaces, what is on which floor.

Return ONLY one word: ENERGY or BUILDING

Question:
{question}
"""

    res = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )
    answer = res.text.strip().upper()

    if "BUILDING" in answer:
        return "BUILDING"
    return "ENERGY"


# -----------------------------------
# BUILDING QUESTION ANSWERER
# -----------------------------------
def answer_building_question(question: str, building_chunks: list) -> str:
    context = "\n".join([
        f"Floor: {r[0]}, Room: {r[1]}, Info: {r[2]}"
        for r in building_chunks
    ])

    prompt = f"""
You are a building information assistant for an educational building.

Answer the user question using ONLY the building context provided below.

Building Context:
{context}

Question:
{question}

Give a clear, simple, human-friendly answer.
List rooms or areas if relevant.
"""

    res = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )
    return res.text.strip()


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
        model=MODEL_NAME,
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
        model=MODEL_NAME,
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
        model=MODEL_NAME,
        contents=prompt
    )
    return res.text.strip()