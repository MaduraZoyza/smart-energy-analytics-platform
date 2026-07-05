import os
import psycopg2
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY"),
    http_options={"api_version": "v1"}   # ← forces stable v1 endpoint
)

conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD")
)

# -----------------------------------
# RECOMMENDATION RULES
# -----------------------------------
rules = [
    {
        "category": "HVAC",
        "condition": "HVAC running with low occupancy",
        "recommendation": "Reduce cooling in low occupancy zones. Consider scheduling HVAC off during unoccupied hours."
    },
    {
        "category": "Lighting",
        "condition": "Lighting active during daytime with high outside temperature",
        "recommendation": "Switch to occupancy sensors for lighting control. Maximize natural daylight usage."
    },
    {
        "category": "Lighting",
        "condition": "Outdoor lighting active during daylight hours",
        "recommendation": "Install daylight sensors on outdoor lighting to prevent unnecessary usage during daytime."
    },
    {
        "category": "Plug Loads",
        "condition": "High plug load during weekend",
        "recommendation": "Audit plug loads on weekends. Unplug non-essential equipment when building is unoccupied."
    },
    {
        "category": "Server Room",
        "condition": "Server room energy spike outside business hours",
        "recommendation": "Investigate server room for unexpected processes. Verify cooling is optimized for actual load."
    },
    {
        "category": "HVAC",
        "condition": "HVAC high energy during mild outside temperature",
        "recommendation": "Outside temperature is mild. Consider natural ventilation instead of mechanical cooling."
    },
    {
        "category": "Elevators",
        "condition": "Elevator energy high during low occupancy",
        "recommendation": "Set elevators to sleep mode during off-peak hours to reduce standby consumption."
    },
    {
        "category": "General",
        "condition": "Overall energy consumption above average on weekend",
        "recommendation": "Review weekend schedules. Most systems should be in standby or off mode."
    }
]


# -----------------------------------
# EMBED AND INSERT
# -----------------------------------
cur = conn.cursor()

for rule in rules:

    # Combine condition + recommendation for embedding
    text = f"{rule['condition']}. {rule['recommendation']}"

    # Generate embedding
    result = client.models.embed_content(
        model="models/gemini-embedding-001",
        contents=text
    )

    embedding = result.embeddings[0].values  

    # Insert into DB
    cur.execute("""
        INSERT INTO recommendation_rules (category, condition, recommendation, embedding)
        VALUES (%s, %s, %s, %s)
    """, (
        rule["category"],
        rule["condition"],
        rule["recommendation"],
        embedding
    ))

    print(f"✅ Inserted: {rule['category']} — {rule['condition']}")

conn.commit()
cur.close()
conn.close()

print("\n✅ All rules inserted successfully!")