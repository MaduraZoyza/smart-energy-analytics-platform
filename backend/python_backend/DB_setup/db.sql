# STEP 1 - Create the database

CREATE DATABASE smart_energy;


# STEP 2 - Create the table

\c smart_energy

CREATE TABLE energy_readings (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    floor_area VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    energy_kwh DECIMAL(10, 4) NOT NULL,
    time_period VARCHAR(50),
    is_weekend BOOLEAN,
    working_hours BOOLEAN,
    zone_name VARCHAR(100)
);


# STEP 3 - Import CSV data into the table

# The CSV file is located at: backend/data/final_june_2026_energy_data.csv
# Run this command in your terminal (NOT inside psql):

psql -U postgres -d smart_energy -c "\copy energy_readings(timestamp, floor_area, category, energy_kwh, time_period, is_weekend, working_hours, zone_name) FROM '/full/path/to/backend/data/final_june_2026_energy_data.csv' CSV HEADER;"

# Replace /full/path/to/ with your actual project path, for example:
# psql -U postgres -d smart_energy -c "\copy energy_readings(timestamp, floor_area, category, energy_kwh, time_period, is_weekend, working_hours, zone_name) FROM '/Users/yourname/Documents/smart-energy-analytics-platform/backend/data/final_june_2026_energy_data.csv' CSV HEADER;"

# After running, verify with:
psql -U postgres -d smart_energy -c "SELECT COUNT(*) FROM energy_readings;"
# Should return 18000 rows

psql -U postgres -d smart_energy -c "SELECT ROUND(SUM(energy_kwh)::numeric, 2) FROM energy_readings;"
# Should return 147498.52

#..........AI DATABASE TABLES setup..........................................

#STEP 4 for run the RAg system for AI recomendation wedge
#  need this youtube guide to setup the vector extension in the database

#  "https://www.youtube.com/watch?v=ZwASqFrUXVw"

CREATE EXTENSION IF NOT EXISTS vector;  
#if this fails follow above vedio


# Run these two SQL commands in your smart_energy database:
# below table is for storing the building chunks and their embeddings

CREATE TABLE building_chunks (
    id SERIAL PRIMARY KEY,
    floor TEXT,
    room TEXT,
    description TEXT,
    embedding vector(3072)
);


#below table is for storing the recommendation rules and their embeddings

CREATE TABLE recommendation_rules (
    id SERIAL PRIMARY KEY,
    category TEXT,
    condition TEXT,
    recommendation TEXT,
    embedding vector(3072)
);
#Why 3072? Gemini's embedding-001 model outputs 3072-dimensional vectors — must match exactly.


