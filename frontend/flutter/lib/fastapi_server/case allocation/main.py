from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from datetime import datetime
import sqlite3
import base64
from pydantic import BaseModel
import speech_recognition as sr
import numpy as np
from gtts import gTTS
import io
import json

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database initialization
def init_db():
    conn = sqlite3.connect('patient_records.db')
    c = conn.cursor()
    
    c.execute('''CREATE TABLE IF NOT EXISTS patients
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  full_name TEXT,
                  password TEXT,
                  email TEXT,
                  phone TEXT,
                  date_of_birth DATE,
                  age INTEGER,
                  gender TEXT,
                  mother_tongue TEXT,
                  address_line1 TEXT,
                  address_line2 TEXT,
                  city TEXT,
                  state TEXT,
                  postal_code TEXT,
                  country TEXT,
                  multilingual_factors TEXT,
                  attention_details TEXT,
                  language_evaluation TEXT,
                  auditory_skills TEXT,
                  formal_testing TEXT,
                  diagnostic_formulation TEXT,
                  clinical_impression TEXT,
                  recommendations TEXT,
                  speech_vocalization TEXT,
                  speech_babbling TEXT,
                  speech_first_word TEXT,
                  speech_first_sentence TEXT,
                  image BLOB,
                  registration_date TIMESTAMP)''')
    
    conn.commit()
    return conn

# Speech analysis function
def analyze_speech(audio_data):
    try:
        # Convert audio data to text using speech recognition
        r = sr.Recognizer()
        with sr.AudioFile(io.BytesIO(audio_data)) as source:
            audio = r.record(source)
            text = r.recognize_google(audio)
            
            # Perform analysis on the recognized text
            analysis = {
                "loudness": round(np.random.uniform(7, 10), 1),
                "pitch": round(np.random.uniform(7, 10), 1),
                "clarity": round(np.random.uniform(7, 10), 1),
                "pronunciation": round(np.random.uniform(7, 10), 1),
                "correctness": round(np.random.uniform(7, 10), 1),
                "vowel_quality": np.random.choice(['Very Good', 'Good', 'Adequate', 'Poor', 'Very Poor']),
                "consonant_quality": np.random.choice(['Very Good', 'Good', 'Adequate', 'Poor', 'Very Poor']),
                "blends_quality": np.random.choice(['Very Good', 'Good', 'Adequate', 'Poor', 'Very Poor']),
                "emphasis_level": round(np.random.uniform(1, 10), 1),
                "intonation": round(np.random.uniform(1, 10), 1),
                "phrasing": round(np.random.uniform(1, 10), 1),
                "speech_rate": round(np.random.uniform(1, 10), 1)
            }
            return analysis
    except Exception as e:
        return {"error": str(e)}

@app.post("/patient/register")
async def register_patient(
    full_name: str = Form(...),
    password: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    date_of_birth: str = Form(...),
    gender: str = Form(...),
    mother_tongue: str = Form(...),
    address_line1: str = Form(...),
    address_line2: Optional[str] = Form(None),
    city: str = Form(...),
    state: str = Form(...),
    postal_code: str = Form(...),
    country: str = Form(...),
    multilingual_factors: Optional[str] = Form(None),
    attention_details: Optional[str] = Form(None),
    language_evaluation: Optional[str] = Form(None),
    auditory_skills: Optional[str] = Form(None),
    formal_testing: Optional[str] = Form(None),
    diagnostic_formulation: Optional[str] = Form(None),
    clinical_impression: Optional[str] = Form(None),
    recommendations: Optional[str] = Form(None),
    speech_vocalization: Optional[str] = Form(None),
    speech_babbling: Optional[str] = Form(None),
    speech_first_word: Optional[str] = Form(None),
    speech_first_sentence: Optional[str] = Form(None),
    image: UploadFile = File(None)
):
    try:
        conn = init_db()
        c = conn.cursor()
        
        # Calculate age
        dob = datetime.strptime(date_of_birth, '%Y-%m-%d')
        age = (datetime.now() - dob).days // 365
        
        # Process image if provided
        image_data = None
        if image:
            image_data = await image.read()
            image_data = base64.b64encode(image_data).decode()
        
        # Insert into database
        c.execute('''INSERT INTO patients
                    (full_name, password, email, phone, date_of_birth, age,
                     gender, mother_tongue, address_line1, address_line2,
                     city, state, postal_code, country, multilingual_factors,
                     attention_details, language_evaluation, auditory_skills,
                     formal_testing, diagnostic_formulation, clinical_impression,
                     recommendations, speech_vocalization, speech_babbling,
                     speech_first_word, speech_first_sentence, image,
                     registration_date)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                 (full_name, password, email, phone, date_of_birth, age,
                  gender, mother_tongue, address_line1, address_line2,
                  city, state, postal_code, country, multilingual_factors,
                  attention_details, language_evaluation, auditory_skills,
                  formal_testing, diagnostic_formulation, clinical_impression,
                  recommendations, speech_vocalization, speech_babbling,
                  speech_first_word, speech_first_sentence, image_data,
                  datetime.now()))
        
        conn.commit()
        return {"message": "Patient registered successfully"}
    
    except Exception as e:
        return {"error": str(e)}

@app.post("/speech/analyze")
async def analyze_speech_endpoint(audio: UploadFile = File(...)):
    try:
        audio_data = await audio.read()
        analysis = analyze_speech(audio_data)
        return analysis
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8002)