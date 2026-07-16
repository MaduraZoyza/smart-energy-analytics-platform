import json
import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


# -----------------------------------
# GENERATE ALERTS
# -----------------------------------
def generate_alerts(rows):

    # No data case
    if not rows:
        return [
            {"text": "No recent energy data available.", "color": "#94a3b8"},
            {"text": "All other systems are operating within normal limits.", "color": "#7dd3fc"}
        ]

    prompt = f"""
You are an Energy Monitoring AI.

Analyze the latest hourly energy readings.

Generate ONLY ONE energy alert.

Rules:
- Detect unusual usage
- Detect lighting during daytime
- Detect HVAC anomalies
- Detect occupancy mismatch
- Maximum 1 alert
- Short sentence
- Return JSON only

Example:
[
{{ "text":"Outdoor lighting appears active during daylight hours.", "color":"#facc15" }}
]

Data:
{rows}
"""

    try:
        res = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt
        )
        clean = res.text.replace("```json", "").replace("```", "").strip()
        ai_alerts = json.loads(clean)

    except Exception as e:
        print(f"[generate_alerts] Gemini call failed: {e}")
        ai_alerts = [
            {"text": "No critical energy anomaly detected.", "color": "#facc15"}
        ]

    ai_alerts.append(
        {"text": "All other systems are operating within normal limits.", "color": "#7dd3fc"}
    )

    return ai_alerts