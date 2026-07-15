import psycopg2
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

# -------------------
# DB CONNECTION
# -------------------
try:
    conn = psycopg2.connect(
        host="localhost",
        port="5432",   # FIXED
        database="smart_energy",
        user="postgres",
        password="energy123"
    )
    print("Database Connected Successfully")

except Exception as e:
    print("Database Connection Failed:", str(e))
    exit()

# -------------------
# GEMINI CLIENT
# -------------------
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ GEMINI_API_KEY not found in .env")
    exit()

client = genai.Client(api_key=api_key)


# -------------------
# EMBEDDING HELPER  (matches rag.py — gemini-embedding-001, 3072-dim)
# -------------------
def get_embedding(text: str):
    result = client.models.embed_content(
        model="models/gemini-embedding-001",
        contents=text
    )
    return result.embeddings[0].values





# -------------------
# TEST 1: TEXT GENERATION
# -------------------
try:
    r = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Say hello"
    )
    print("Text API Success:", r.text)

except Exception as e:
    error_msg = str(e)

    if "quota" in error_msg.lower() or "exceeded" in error_msg.lower():
        print("❌ API Quota Exceeded")
    elif "api key" in error_msg.lower():
        print("❌ Invalid API Key")
    else:
        print("❌ Gemini Text API Error:", error_msg)

# -------------------
# TEST 2: EMBEDDING (from your test_key.py)
# -------------------
try:
    vector = get_embedding("test")
 
    print("Embedding Success!")
    print("Vector length:", len(vector))
 
except Exception as e:
    print("❌ Embedding Error:", str(e))