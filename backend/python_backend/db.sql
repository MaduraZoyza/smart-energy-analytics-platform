#step 1 create 1st database table.............................................

#create the database
#@shane  add here
#create database smart_energy;




#STEP 2 create the table........................................................

#@shane  add here




#STEP 3 add CSV data from the CSV file in Data folder in to the table......................

#@shane  add here







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


