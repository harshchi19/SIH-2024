import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import PyPDF2
import re
import pandas as pd
import matplotlib.pyplot as plt

# Create FastAPI app
app = FastAPI()

# Load environment variables
load_dotenv()
openai_api_key = os.getenv("GITHUB_TOKEN")

if not openai_api_key:
    raise ValueError("GitHub Token is not set. Please add it to your .env file.")

# Database setup
DATABASE_URL = "sqlite:///./files.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# File table definition
# Base = declarative_base()

class UploadedFile(Base):
    __tablename__ = "uploaded_files"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)

# Create tables
Base.metadata.create_all(bind=engine)

# Function to extract text from PDF files
def extract_pdf_text(pdf_files):
    texts = []
    for pdf_file in pdf_files:
        try:
            reader = PyPDF2.PdfReader(pdf_file)
            pdf_text = ""
            for page in reader.pages:
                pdf_text += page.extract_text()
            texts.append(pdf_text)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")
    return texts

# Function to simulate OpenAI API analysis
def analyze_therapy_documents(pdf_texts):
    # Simulated response
    analysis_result = """
    Student Name: John Doe
    ID: 12345
    Therapist Name: Dr. Smith

    Diagnosis Summary:
    - Mild anxiety, moderate ADHD.

    Progress Tracking:
    Session 1: Progress = 65%
    Session 2: Progress = 75%
    Session 3: Progress = 85%
    Session 4: Progress = 90%

    Personalized Recommendations:
    - Include mindfulness exercises.
    - Use adaptive learning strategies.
    """
    return analysis_result

# API Endpoint to upload and process PDF files
@app.post("/analyze_pdfs/")
async def analyze_pdfs(files: list[UploadFile] = File(...)):
    if len(files) != 4:
        raise HTTPException(status_code=400, detail="Please upload exactly 4 PDF files.")

    file_paths = []
    with SessionLocal() as db:
        for file in files:
            file_location = f"uploaded_files/{file.filename}"
            os.makedirs("uploaded_files", exist_ok=True)
            with open(file_location, "wb") as file_object:
                file_object.write(await file.read())

            # Save file info to database
            db_file = UploadedFile(filename=file.filename, filepath=file_location)
            db.add(db_file)
            db.commit()
            db.refresh(db_file)

            file_paths.append(file_location)

    # Extract text from PDFs
    extracted_texts = extract_pdf_text([open(file, "rb") for file in file_paths])

    # Analyze texts
    analysis_result = analyze_therapy_documents(extracted_texts)

    # Save analysis report
    report_path = "analysis_report.txt"
    with open(report_path, "w") as report_file:
        report_file.write(analysis_result)

    return JSONResponse({
        "message": "Files uploaded and analyzed successfully.",
        "report_download_url": "/download_report/",
    })

# Endpoint to list uploaded files
@app.get("/list_files/")
async def list_files():
    with SessionLocal() as db:
        files = db.query(UploadedFile).all()
        return [{"id": file.id, "filename": file.filename, "filepath": file.filepath} for file in files]

# Endpoint to download specific uploaded file
@app.get("/download_file/{file_id}")
async def download_file(file_id: int):
    with SessionLocal() as db:
        file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
        if file:
            return FileResponse(file.filepath, media_type="application/pdf", filename=file.filename)
    raise HTTPException(status_code=404, detail="File not found.")

# Endpoint to download analysis report
@app.get("/download_report/")
async def download_report():
    report_path = "analysis_report.txt"
    if os.path.exists(report_path):
        return FileResponse(report_path, media_type="text/plain", filename="analysis_report.txt")
    raise HTTPException(status_code=404, detail="Report not found.")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8004)