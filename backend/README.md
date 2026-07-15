# Smart Energy Assistant - Backend

## Overview

This backend provides:

* FastAPI API
* Gemini AI integration
* PostgreSQL database connection
* Energy consumption query endpoint

Current flow:

User Question → FastAPI → Gemini → PostgreSQL → Response

---



## Project Structure

backend/
├── main.py
├── test_db_API_key.py
├── ingest_rules.py
├── ingest_pdf.py
├── db.sql
├── .env
├── requirements.txt
└── venv/

---



## INITIAL STEP  Configure Gemini API Key

Create file: inside "/python_backend" (use "env.example" format )

```text
.env
```

Add:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Get API key from:

https://aistudio.google.com/app/apikey

---



## PostgreSQL Configuration

Current database:


Update credentials in:

```python
psycopg2.connect(
    host="localhost",
    port="5432",
    database="smart_energy",
    user="postgres",
    password="YOUR_PASSWORD"
)
```





## Step 1 — Setup Database
Run the schema and gudance from "backend/db.sql" in PostgreSQL, then verify your setup: (need to setup vector database in postgresql)


```bash
python test_db_API_key.py
```

This checks: ✅ Database connection ✅ API key loaded ✅ Key not expired






## Step 2 — Ingest Rules for RAG system 

```bash
python ingest_rules.py
```
create the vector database rules and embedding



## Step 3 — Ingest PDFs for RAG system
```bash
python ingest_pdf.py
```
create the vector database from extracted data from thesis Drawing.pdf 



## Create Virtual Environment

Open terminal inside backend folder:

```bash
python -m venv venv
```

Activate environment:

### Windows PowerShell

```powershell
.\venv\Scripts\Activate
```

Expected:

```text
(venv)
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---







## Run Backend Server

```bash
uvicorn main:app --reload
```

Expected:

```text
Uvicorn running on:

http://127.0.0.1:8000
```

---

## API Documentation

Open:

```text
http://127.0.0.1:8000/docs
```

Swagger UI will be available.

---

## Current Supported Question

Example:

```text
What is energy usage on Floor 1?
```

Response:

```text
Total energy consumption for Floor 1 is XX kWh
```

---

## Current Version

Version 1 Features:

* React frontend connection
* FastAPI backend
* Gemini AI
* PostgreSQL integration
* Floor-based energy query

Future versions:

* Dynamic SQL generation
* Category analysis
* Trend analysis
* Forecasting
* Dashboards
