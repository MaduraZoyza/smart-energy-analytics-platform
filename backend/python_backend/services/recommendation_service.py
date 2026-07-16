import json
import os
from google import genai
from db import get_db
from services.rag_service import get_embedding, search_building_chunks, search_recommendation_rules
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


# -----------------------------------
# GET RECENT ENERGY DATA
# -----------------------------------
def get_recent_energy():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            timestamp,
            building,
            floor_area,
            category,
            energy_kwh,
            avg_power_kw,
            occupancy_level,
            outside_temp_c,
            is_weekend
        FROM energy_readings
        ORDER BY timestamp DESC
        LIMIT 10
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows


# -----------------------------------
# GET RECOMMENDATIONS
# -----------------------------------
async def get_recommendations():

    # STEP 1: Get recent energy data
    energy_data = get_recent_energy()

    if not energy_data:
        return [
            {
                "title": "No Data",
                "detail": "No recent energy data available to generate recommendations.",
                "floor": "N/A",
                "category": "General"
            }
        ]

    # STEP 2: Summarize energy data
    energy_summary = []
    for row in energy_data:
        timestamp, building, floor_area, category, energy_kwh, avg_power_kw, occupancy_level, outside_temp_c, is_weekend = row
        energy_summary.append(
            f"{category} on {floor_area}: {energy_kwh} kWh, occupancy {occupancy_level}, temp {outside_temp_c}C, weekend={is_weekend}"
        )

    query_text = " ".join(energy_summary[:5])

    # STEP 3: Get query embedding
    query_embedding = get_embedding(query_text)

    # STEP 4: Retrieve building context
    building_context = search_building_chunks(query_embedding, top_k=3)

    # STEP 5: Retrieve recommendation rules
    relevant_rules = search_recommendation_rules(query_embedding, top_k=3)

    # STEP 6: Format context for Gemini
    building_text = "\n".join([
        f"Floor: {r[0]}, Room: {r[1]}, Info: {r[2]}"
        for r in building_context
    ])

    rules_text = "\n".join([
        f"Category: {r[0]}, Condition: {r[1]}, Rule: {r[2]}"
        for r in relevant_rules
    ])

    energy_text = "\n".join(energy_summary)

    # STEP 7: Gemini RAG prompt
    prompt = f"""
You are a Smart Energy Advisor for an educational building.

You have 3 sources of information:

--- RECENT ENERGY DATA ---
{energy_text}

--- BUILDING CONTEXT (from architectural drawings) ---
{building_text}

--- ENERGY RECOMMENDATION RULES ---
{rules_text}

Based on ALL THREE sources above, generate EXACTLY 3 smart energy recommendations.

Rules:
- Each recommendation must reference a specific floor or room from the building context
- Each recommendation must be actionable and specific
- Keep each recommendation to 2 sentences maximum
- Return ONLY valid JSON, no extra text

Return this exact format:
[
    {{
        "title": "short title",
        "detail": "actionable recommendation sentence",
        "floor": "floor name",
        "category": "category name"
    }},
    {{
        "title": "short title",
        "detail": "actionable recommendation sentence",
        "floor": "floor name",
        "category": "category name"
    }},
    {{
        "title": "short title",
        "detail": "actionable recommendation sentence",
        "floor": "floor name",
        "category": "category name"
    }}
]
"""

    # STEP 8: Call Gemini
    try:
        res = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt
        )
        clean = res.text.replace("```json", "").replace("```", "").strip()
        recommendations = json.loads(clean)

    except Exception as e:
        print(f"[get_recommendations] Gemini call failed: {e}")
        recommendations = [
            {
                "title": "Energy Review Needed",
                "detail": "Could not generate recommendations. Please check system logs.",
                "floor": "All Floors",
                "category": "General"
            }
        ]

    return recommendations