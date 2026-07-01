import os
from google import genai
from db import get_db
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


# -----------------------------------
# GET EMBEDDING
# -----------------------------------
def get_embedding(text: str):
    result = client.models.embed_content(
        model="models/gemini-embedding-001",
        contents=text
    )
    return result.embeddings[0].values


# -----------------------------------
# SEARCH BUILDING CHUNKS
# -----------------------------------
def search_building_chunks(query_embedding, top_k=3):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT floor, room, description
        FROM building_chunks
        ORDER BY embedding <-> %s::vector
        LIMIT %s
    """, (query_embedding, top_k))

    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows


# -----------------------------------
# SEARCH RECOMMENDATION RULES
# -----------------------------------
def search_recommendation_rules(query_embedding, top_k=3):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT category, condition, recommendation
        FROM recommendation_rules
        ORDER BY embedding <-> %s::vector
        LIMIT %s
    """, (query_embedding, top_k))

    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows