import os
import pdfplumber
import psycopg2
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD")
)

# -----------------------------------
# BUILDING CHUNKS FROM YOUR PDF
# manually extracted from thesis drawings
# -----------------------------------
building_chunks = [

    # GROUND FLOOR
    {
        "floor": "Ground Floor",
        "room": "Food Processing Laboratory",
        "description": "Ground Floor. Food Processing Laboratory. Category: Lab. Cooling: Mechanical Ventilation. Notes: Chemical Store nearby."
    },
    {
        "floor": "Ground Floor",
        "room": "Livestock Production Laboratory",
        "description": "Ground Floor. Livestock Production Laboratory. Category: Lab. Cooling: Mechanical Ventilation."
    },
    {
        "floor": "Ground Floor",
        "room": "Food Microbiology Laboratory",
        "description": "Ground Floor. Food Microbiology Laboratory. Category: Lab. Includes Incubation Room, Discarding Room, Instrument Room."
    },
    {
        "floor": "Ground Floor",
        "room": "Food Analysis Laboratory",
        "description": "Ground Floor. Food Analysis Laboratory. Category: Lab. Air Conditioned. Includes Media Preparation Room."
    },
    {
        "floor": "Ground Floor",
        "room": "100 Lecture Hall",
        "description": "Ground Floor. 100 Lecture Hall. Category: Lecture. Large hall. Stage present. High occupancy space."
    },
    {
        "floor": "Ground Floor",
        "room": "Chemical Store",
        "description": "Ground Floor. Chemical Store. Category: Storage. Two chemical stores present. Low occupancy."
    },
    {
        "floor": "Ground Floor",
        "room": "Gas Storage",
        "description": "Ground Floor. Gas Storage. Category: Storage. Low occupancy. Safety critical area."
    },
    {
        "floor": "Ground Floor",
        "room": "Informal Learning Area",
        "description": "Ground Floor. Informal Learning Area. Category: Common Area. Open space. Variable occupancy."
    },

    # FIRST FLOOR
    {
        "floor": "First Floor",
        "room": "IT Lab 1",
        "description": "First Floor. IT Lab 1. Category: IT Lab. Air Conditioned. High plug load expected from computers."
    },
    {
        "floor": "First Floor",
        "room": "IT Lab 2",
        "description": "First Floor. IT Lab 2. Category: IT Lab. Air Conditioned. High plug load expected from computers."
    },
    {
        "floor": "First Floor",
        "room": "IT Lab 3",
        "description": "First Floor. IT Lab 3. Category: IT Lab. Air Conditioned. High plug load expected from computers."
    },
    {
        "floor": "First Floor",
        "room": "200 Lecture Hall",
        "description": "First Floor. 200 Lecture Hall. Category: Lecture. Large hall. Very high occupancy. Air Conditioned."
    },
    {
        "floor": "First Floor",
        "room": "50 Lecture Room 5",
        "description": "First Floor. 50 Lecture Room 5. Category: Lecture. Medium occupancy. Air Conditioned."
    },
    {
        "floor": "First Floor",
        "room": "Media Room",
        "description": "First Floor. Media Room. Category: Media. Air Conditioned. AV equipment present."
    },
    {
        "floor": "First Floor",
        "room": "Terrace",
        "description": "First Floor. Terrace. Category: Outdoor. No cooling required. Natural ventilation."
    },

    # SECOND FLOOR
    {
        "floor": "Second Floor",
        "room": "50 Lecture Room 9",
        "description": "Second Floor. 50 Lecture Room 9. Category: Lecture. Medium occupancy."
    },
    {
        "floor": "Second Floor",
        "room": "50 Lecture Room 10",
        "description": "Second Floor. 50 Lecture Room 10. Category: Lecture. Medium occupancy."
    },
    {
        "floor": "Second Floor",
        "room": "50 Lecture Room 11",
        "description": "Second Floor. 50 Lecture Room 11. Category: Lecture. Medium occupancy."
    },
    {
        "floor": "Second Floor",
        "room": "50 Lecture Room 12",
        "description": "Second Floor. 50 Lecture Room 12. Category: Lecture. Medium occupancy."
    },
    {
        "floor": "Second Floor",
        "room": "Lecturers Room",
        "description": "Second Floor. Lecturers Room. Category: Office. Low to medium occupancy. Air Conditioned."
    },

    # THIRD FLOOR
    {
        "floor": "Third Floor",
        "room": "Lecture Room 13",
        "description": "Third Floor. Lecture Room 13. Category: Lecture. Medium occupancy."
    },
    {
        "floor": "Third Floor",
        "room": "Lecture Room 14",
        "description": "Third Floor. Lecture Room 14. Category: Lecture. Medium occupancy."
    },
    {
        "floor": "Third Floor",
        "room": "Server Room",
        "description": "Third Floor. Server Room. Category: IT. High energy consumption. Air Conditioned."
    },
    {
        "floor": "Third Floor",
        "room": "Lecture Room 15",
        "description": "Third Floor. Lecture Room 15. Category: Lecture. Medium occupancy."
    },
    {
        "floor": "Third Floor",
        "room": "Lecturers Room",
        "description": "Third Floor. Lecturers Room. Category: Office. Low to medium occupancy. Air Conditioned."
    },
]


# -----------------------------------
# EMBED AND INSERT
# -----------------------------------
cur = conn.cursor()

for chunk in building_chunks:

    # Generate embedding from description
    result = client.models.embed_content(
        model="models/gemini-embedding-001",
        contents=chunk["description"],
    )

    embedding = result.embeddings[0].values

    cur.execute("""
        INSERT INTO building_chunks (floor, room, description, embedding)
        VALUES (%s, %s, %s, %s)
    """, (
        chunk["floor"],
        chunk["room"],
        chunk["description"],
        embedding
    ))

    print(f"✅ Inserted: {chunk['floor']} — {chunk['room']}")

conn.commit()
cur.close()
conn.close()

print("\n✅ All building chunks inserted successfully!")