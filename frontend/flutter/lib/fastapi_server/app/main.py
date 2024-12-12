# import os
# import io
# import json
# import base64
# import sqlite3
# from typing import List, Dict, Optional
# from datetime import datetime
# import uuid

# import pdfplumber
# from PIL import Image
# from openai import OpenAI
# import pandas as pd

# from fastapi import FastAPI, File, UploadFile, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel

# # Configuration
# GITHUB_TOKEN = "your_github_pat_token"
# ENDPOINT = "https://models.inference.ai.azure.com"
# MODEL_NAME = "gpt-4o"

# # Initialize GitHub AI Model Client
# client = OpenAI(
#     base_url=ENDPOINT,
#     api_key=GITHUB_TOKEN
# )

# app = FastAPI(title="Medical Case Processing API")

# # CORS Configuration
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Allow all origins
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class CaseData(BaseModel):
#     case_name: str
#     case_no: str
#     age_sex: str
#     date_of_assignment: str
#     student_clinician: str
#     supervisor: str
#     provisional_diagnosis: str
#     findings: Dict
#     confidence_score: Optional[str] = "medium"

# def encode_image_to_base64(image: Image.Image) -> str:
#     """Convert PIL Image to base64 string"""
#     buffered = io.BytesIO()
#     image.save(buffered, format="PNG")
#     return base64.b64encode(buffered.getvalue()).decode('utf-8')

# def extract_text_with_github_vision(image: Image.Image) -> str:
#     """Extract text from image using GitHub's GPT-4o with vision capabilities"""
#     try:
#         base64_image = encode_image_to_base64(image)
        
#         response = client.chat.completions.create(
#             model=MODEL_NAME,
#             messages=[
#                 {
#                     "role": "user",
#                     "content": [
#                         {
#                             "type": "text",
#                             "text": "Carefully analyze this medical document and extract all visible text, including both printed and handwritten content."
#                         },
#                         {
#                             "type": "image_url",
#                             "image_url": {
#                                 "url": f"data:image/png;base64,{base64_image}",
#                                 "detail": "high"
#                             }
#                         }
#                     ]
#                 }
#             ],
#             max_tokens=4096,
#             temperature=0.1
#         )
        
#         return response.choices[0].message.content
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"GitHub AI Vision processing error: {str(e)}")

# def extract_text_from_pdf(pdf_file: io.BytesIO) -> str:
#     """Extract text from PDF pages"""
#     extracted_text = ""
#     with pdfplumber.open(pdf_file) as pdf:
#         for page in pdf.pages:
#             extracted_text += page.extract_text() or ""
#     return extracted_text

# def extract_case_info_with_github_ai(text: str) -> CaseData:
#     """Extract structured medical case information using GitHub's GPT-4o"""
#     try:
#         system_prompt = """You are a medical case documentation specialist..."""  # Truncated for brevity
        
#         response = client.chat.completions.create(
#             model=MODEL_NAME,
#             messages=[
#                 {"role": "system", "content": system_prompt},
#                 {"role": "user", "content": f"Extract case information from: {text}"}
#             ],
#             response_format={"type": "json_object"},
#             temperature=0.1,
#             max_tokens=4096
#         )
        
#         case_data_dict = json.loads(response.choices[0].message.content)
#         return CaseData(**case_data_dict)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Case info extraction error: {str(e)}")

# def save_to_database(case_data: CaseData, document_bytes: bytes, extracted_text: str):
#     """Save detailed case data to SQLite database"""
#     try:
#         conn = sqlite3.connect('medical_cases.db')
#         cursor = conn.cursor()
        
#         cursor.execute('''
#         CREATE TABLE IF NOT EXISTS cases (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             case_name TEXT,
#             case_no TEXT,
#             age_sex TEXT,
#             date_of_assignment TEXT,
#             student_clinician TEXT,
#             supervisor TEXT,
#             provisional_diagnosis TEXT,
#             findings TEXT,
#             document BLOB,
#             extracted_text TEXT,
#             timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
#         )
#         ''')
        
#         findings_json = json.dumps(case_data.findings)
        
#         cursor.execute('''
#         INSERT INTO cases (
#             case_name, case_no, age_sex, date_of_assignment, 
#             student_clinician, supervisor, provisional_diagnosis, 
#             findings, document, extracted_text
#         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
#         ''', (
#             case_data.case_name,
#             case_data.case_no,
#             case_data.age_sex,
#             case_data.date_of_assignment,
#             case_data.student_clinician,
#             case_data.supervisor,
#             case_data.provisional_diagnosis,
#             findings_json,
#             document_bytes,
#             extracted_text
#         ))
        
#         conn.commit()
#         conn.close()
#         return True
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# @app.post("/process_document/")
# async def process_document(file: UploadFile = File(...)):
#     """Process a single document (PDF or Image)"""
#     try:
#         file_content = await file.read()
        
#         # Determine file type and extract text
#         if file.content_type == "application/pdf":
#             extracted_text = extract_text_from_pdf(io.BytesIO(file_content))
#         elif file.content_type in ["image/jpeg", "image/png"]:
#             image = Image.open(io.BytesIO(file_content))
#             extracted_text = extract_text_with_github_vision(image)
#         else:
#             raise HTTPException(status_code=400, detail="Unsupported file type")
        
#         # Extract case information
#         case_data = extract_case_info_with_github_ai(extracted_text)
        
#         # Save to database
#         save_to_database(case_data, file_content, extracted_text)
        
#         return {
#             "case_data": case_data.dict(),
#             "extracted_text": extracted_text
#         }
    
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.post("/process_multiple_documents/")
# async def process_multiple_documents(files: List[UploadFile] = File(...)):
#     """Process multiple documents in a batch"""
#     results = []
    
#     for file in files:
#         file_content = await file.read()
        
#         # Determine file type and extract text
#         if file.content_type == "application/pdf":
#             extracted_text = extract_text_from_pdf(io.BytesIO(file_content))
#         elif file.content_type in ["image/jpeg", "image/png"]:
#             image = Image.open(io.BytesIO(file_content))
#             extracted_text = extract_text_with_github_vision(image)
#         else:
#             continue  # Skip unsupported files
        
#         # Extract case information
#         case_data = extract_case_info_with_github_ai(extracted_text)
        
#         # Save to database
#         save_to_database(case_data, file_content, extracted_text)
        
#         results.append({
#             "filename": file.filename,
#             "case_data": case_data.dict(),
#             "extracted_text": extracted_text
#         })
    
#     return results

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=8000)
# from http import client
# from fastapi import FastAPI, UploadFile, File, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from typing import List
# from io import BytesIO
# from PIL import Image
# import json
# import base64
# import os
# import requests

# # GitHub and HuggingFace API Config
# GITHUB_TOKEN = os.getenv("GITHUB_TOKEN") or "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"
# ENDPOINT = os.getenv("ENDPOINT") or "https://models.inference.ai.azure.com"
# MODEL_NAME = "gpt-4o"
# HF_OCR_API_URL = os.getenv("HF_OCR_API_URL") or "https://api-inference.huggingface.co/models/microsoft/trocr-base-handwritten"
# HF_HEADERS = {"Authorization": "Bearer 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"}

# # Initialize FastAPI app
# app = FastAPI(title="Medical Case Document Processor")

# # Allow CORS for frontend communication
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Adjust this to your frontend URL in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # Helper functions
# def encode_image_to_base64(image):
#     """Convert PIL Image to base64 string."""
#     buffered = BytesIO()
#     image.save(buffered, format="PNG")
#     return base64.b64encode(buffered.getvalue()).decode("utf-8")


# def extract_case_info_with_github_ai(text):
#     """Extract structured medical case information using GitHub's GPT-4o."""
#     try:
#         system_prompt = """You are a medical case documentation specialist. Your task is to:
#         1. Carefully analyze medical case documents
#         2. Extract comprehensive case details with high accuracy
#         3. Maintain patient data confidentiality
#         4. Provide structured and detailed information
#         5. Flag any unclear or ambiguous information
#         """
        
#         # Simulate GPT-4o API Call
#         response = {
#             "choices": [
#                 {
#                     "message": {
#                         "content": json.dumps({
#                             "case_name": "Example Case",
#                             "case_no": "12345",
#                             "age_sex": "30/F",
#                             "date_of_assignment": "2024-12-08",
#                             "student_clinician": "John Doe",
#                             "supervisor": "Dr. Smith",
#                             "provisional_diagnosis": "Sample Diagnosis",
#                             "findings": {
#                                 "opme": "Details...",
#                                 "reception": "Details...",
#                                 "expression": "Details...",
#                                 "pragmatics": "Details...",
#                                 "attention": "Details...",
#                                 "auditory_skill": "Details...",
#                                 "play_behavior": "Details...",
#                                 "general_behavior": "Details...",
#                                 "formal_testing": "Details...",
#                                 "clinical_impression": "Details...",
#                                 "additional_notes": "Details..."
#                             },
#                             "confidence_score": "high"
#                         })
#                     }
#                 }
#             ]
#         }

#         return json.loads(response["choices"][0]["message"]["content"])
#     except Exception as e:
#         return {
#             "case_name": "Unknown",
#             "case_no": "N/A",
#             "age_sex": "Not Specified",
#             "date_of_assignment": "Not Available",
#             "student_clinician": "Not Recorded",
#             "supervisor": "Not Assigned",
#             "provisional_diagnosis": "Pending",
#             "findings": {
#                 "opme": "No observations",
#                 "reception": "No data",
#                 "expression": "Not evaluated",
#                 "pragmatics": "Not assessed",
#                 "attention": "Not measured",
#                 "auditory_skill": "Not tested",
#                 "play_behavior": "No observations",
#                 "general_behavior": "Not documented",
#                 "formal_testing": "No tests performed",
#                 "clinical_impression": "Insufficient information",
#                 "additional_notes": f"Error in extraction: {str(e)}"
#             },
#             "confidence_score": "low"
#         }


# def extract_text_with_huggingface_ocr(image):
#     """Extract text from image using Hugging Face OCR API."""
#     try:
#         image_buffer = BytesIO()
#         image.save(image_buffer, format="jpg")
#         image_data = image_buffer.getvalue()

#         response = requests.post(
#             HF_OCR_API_URL,
#             headers=HF_HEADERS,
#             files={"file": image_data}
#         )

#         if response.status_code == 200:
#             return response.json().get("text", "")
#         else:
#             raise Exception(f"OCR failed: {response.text}")
#     except Exception as e:
#         return f"Error in OCR extraction: {str(e)}"

# def extract_text_with_github_vision(image):
#     """Extract text from image using GitHub's GPT-4o with vision capabilities"""
#     try:
#         # Convert JPG to PNG if the image is in JPG format
#         if image.format != 'PNG':
#             image = image.convert('RGB')  # Convert the image to RGB before saving as PNG
#             buffered = BytesIO()
#             image.save(buffered, format="PNG")
#             base64_image = base64.b64encode(buffered.getvalue()).decode('utf-8')
#         else:
#             base64_image = encode_image_to_base64(image)
        
#         response = client.chat.completions.create(
#             model=MODEL_NAME,
#             messages=[
#                 {
#                     "role": "user",
#                     "content": [
#                         {
#                             "type": "text",
#                             "text": "Carefully analyze this medical document and extract all visible text, including both printed and handwritten content."
#                         },
#                         {
#                             "type": "image_url",
#                             "image_url": {
#                                 "url": f"data:image/png;base64,{base64_image}",
#                                 "detail": "high"
#                             }
#                         }
#                     ]
#                 }
#             ],
#             max_tokens=4096,
#             temperature=0.1
#         )
        
#         return response.choices[0].message.content
#     except Exception as e:
#         print(f"Error in GitHub AI Vision processing: {str(e)}")
#         return ""



# async def combine_and_process_images(files: List[UploadFile]):
#     """Process multiple images of the same prescription/case and combine extracted text."""
#     combined_text = ""
#     documents = []

#     for idx, file in enumerate(files, 1):
#         try:
#             content = await file.read()
#             image = Image.open(BytesIO(content))

#             page_text = extract_text_with_huggingface_ocr(image)
#             combined_text += f"\n\n=== Page {idx} ===\n{page_text}"

#             buffer = BytesIO()
#             image.save(buffer, format="PNG")
#             documents.append(buffer.getvalue())
#         except Exception as e:
#             print(f"Error processing page {idx}: {str(e)}")
#             continue

#     case_data = extract_case_info_with_github_ai(combined_text)
#     return combined_text, case_data, documents


# @app.post("/process_case/")
# async def process_case(files: List[UploadFile] = File(...)):
#     """Process uploaded images and return structured case data."""
#     try:
#         combined_text, case_data, _ = await combine_and_process_images(files)
#         return {
#             "status": "success",
#             "case_data": case_data,
#             "combined_text": combined_text
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing files: {str(e)}")


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=8000)
from http import client
import time
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from io import BytesIO
from PIL import Image
import json
import base64
import os
import requests

# GitHub and HuggingFace API Config
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN") or "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"
ENDPOINT = os.getenv("ENDPOINT") or "https://models.inference.ai.azure.com"
MODEL_NAME = "gpt-4o"
HF_OCR_API_URL = os.getenv("HF_OCR_API_URL") or "https://api-inference.huggingface.co/models/microsoft/trocr-base-handwritten"
HF_HEADERS = {"Authorization": "Bearer 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"}

# Initialize FastAPI app
app = FastAPI(title="Medical Case Document Processor")

# Allow CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Helper functions
def encode_image_to_base64(image):
    """Convert PIL Image to base64 string."""
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")


def extract_case_info_with_github_ai(text):
    """
    Extract structured medical case information from the given text.
    
    Args:
        text (str): Extracted text from medical documents
    
    Returns:
        dict: Structured medical case information
    """
    try:
        # Basic regex and pattern matching to extract key information
        import re

        # Default return structure with placeholders
        case_info = {
            "case_name": "Unassigned",
            "case_no": "N/A",
            "age_sex": "Not Specified",
            "date_of_assignment": "Not Available",
            "student_clinician": "Not Recorded",
            "supervisor": "Not Assigned",
            "provisional_diagnosis": "Pending",
            "findings": {
                "opme": "",
                "reception": "",
                "expression": "",
                "pragmatics": "",
                "attention": "",
                "auditory_skill": "",
                "play_behavior": "",
                "general_behavior": "",
                "formal_testing": "",
                "clinical_impression": "",
                "additional_notes": ""
            },
            "confidence_score": "medium"
        }

        # Extract case number (if present)
        case_no_match = re.search(r'Case\s*[Nn]o\.?\s*:?\s*(\d+)', text)
        if case_no_match:
            case_info["case_no"] = case_no_match.group(1)

        # Extract age and sex
        age_sex_match = re.search(r'(\d+)\s*[/\-]\s*([MmFf])', text)
        if age_sex_match:
            case_info["age_sex"] = f"{age_sex_match.group(1)}/{age_sex_match.group(2).upper()}"

        # Extract student clinician
        clinician_match = re.search(r'[Ss]tudent\s*[Cc]linician\s*:?\s*([A-Za-z\s]+)', text)
        if clinician_match:
            case_info["student_clinician"] = clinician_match.group(1).strip()

        # Extract supervisor
        supervisor_match = re.search(r'[Ss]upervisor\s*:?\s*([A-Za-z\s]+)', text)
        if supervisor_match:
            case_info["supervisor"] = supervisor_match.group(1).strip()

        # Populate findings from text (basic extraction)
        findings_keywords = {
            "opme": "Oral Motor Peripheral Examination",
            "reception": "Reception",
            "expression": "Expression",
            "pragmatics": "Pragmatics",
            "attention": "Attention",
            "auditory_skill": "Auditory Skill",
            "play_behavior": "Play Behavior",
            "general_behavior": "General Behavior",
            "formal_testing": "Formal Testing",
            "clinical_impression": "Clinical Impression"
        }

        # Basic text extraction for each finding
        for key, keyword in findings_keywords.items():
            # Look for text between the keyword and the next keyword or end of text
            finding_match = re.search(fr'{keyword}[:\s]*(.+?)(?=\n\n|\n[A-Z]|$)', text, re.DOTALL | re.IGNORECASE)
            if finding_match:
                case_info["findings"][key] = finding_match.group(1).strip()

        # Set additional notes if relevant
        case_info["findings"]["additional_notes"] = text[:500]  # First 500 chars as additional context

        # Determine confidence score based on extracted information
        extracted_fields = sum(1 for value in case_info.values() if value != "Not Available" and value != "Pending")
        case_info["confidence_score"] = "high" if extracted_fields > 5 else "medium"

        return case_info

    except Exception as e:
        # Fallback error handling
        case_info = case_info.copy()
        case_info["findings"]["additional_notes"] = f"Error in extraction: {str(e)}"
        case_info["confidence_score"] = "low"
        return case_info



def extract_text_with_github_vision(image):
    """Extract text from image using GitHub's GPT-4o with vision capabilities"""
    try:
        # Convert JPG to PNG if the image is in JPG format
        if image.format != 'PNG':
            image = image.convert('RGB')  # Convert the image to RGB before saving as PNG
            buffered = BytesIO()
            image.save(buffered, format="PNG")
            base64_image = base64.b64encode(buffered.getvalue()).decode('utf-8')
        else:
            base64_image = encode_image_to_base64(image)
        
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Carefully analyze this medical document and extract all visible text, including both printed and handwritten content."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{base64_image}",
                                "detail": "high"
                            }
                        }
                    ]
                }
            ],
            max_tokens=4096,
            temperature=0.1
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error in GitHub AI Vision processing: {str(e)}")
        return ""


def extract_text_with_huggingface_ocr(image, retries=3, delay=5):
    """Extract text from image using Hugging Face OCR API with retry logic."""
    try:
        # Convert image to RGB if it's not in RGB mode (to ensure compatibility)
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Save the image to a buffer in JPEG format
        image_buffer = BytesIO()
        image.save(image_buffer, format="JPEG")
        image_data = image_buffer.getvalue()  # Get the raw bytes of the image

        # Ensure the image data is valid and non-empty
        if not image_data:
            raise Exception("The image data is empty!")

        print(f"Image Data Size: {len(image_data)} bytes")

        for attempt in range(retries):
            # Send the image data to Hugging Face OCR API
            response = requests.post(
                HF_OCR_API_URL,
                headers=HF_HEADERS,
                files={"file": ("image.jpg", image_data, "image/jpeg")},
                timeout=60  # Optional: increase timeout if needed
            )

            if response.status_code == 200:
                return response.json().get("text", "")
            elif response.status_code == 400:
                print(f"OCR API Error: {response.status_code} - {response.text}")
                raise Exception(f"OCR failed: {response.text}")
            elif response.status_code == 503:
                print(f"OCR API Error: {response.status_code} - {response.text}")
                print(f"Retrying in {delay} seconds... (Attempt {attempt + 1}/{retries})")
                time.sleep(delay)  # Wait before retrying
            else:
                print(f"OCR API Error: {response.status_code} - {response.text}")
                raise Exception(f"OCR failed: {response.text}")

        raise Exception("Max retries exceeded for OCR extraction.")

    except Exception as e:
        print(f"Error in OCR extraction: {str(e)}")
        return f"Error in OCR extraction: {str(e)}"

async def combine_and_process_images(files: List[UploadFile]):
    """Process multiple images of the same prescription/case and combine extracted text."""
    combined_text = ""
    documents = []

    for idx, file in enumerate(files, 1):
        try:
            content = await file.read()
            image = Image.open(BytesIO(content))

            # Ensure the image is in RGB format
            if image.mode != 'RGB':
                image = image.convert('RGB')

            page_text = extract_text_with_huggingface_ocr(image)
            combined_text += f"\n\n=== Page {idx} ===\n{page_text}"

            buffer = BytesIO()
            image.save(buffer, format="PNG")
            documents.append(buffer.getvalue())
        except Exception as e:
            print(f"Error processing page {idx}: {str(e)}")
            continue

    case_data = extract_case_info_with_github_ai(combined_text)
    return combined_text, case_data, documents

@app.post("/process_case/")
async def process_case(files: List[UploadFile] = File(...)):
    """Process uploaded images and return structured case data."""
    try:
        combined_text, case_data, _ = await combine_and_process_images(files)
        return {
            "status": "success",
            "case_data": case_data,
            "combined_text": combined_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing files: {str(e)}")

# image_path = r"C:\Users\Vatsal\Downloads\pateint.jpg"
hf_access_token = "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" 

import os

image_path = r"C:\Users\Vatsal\Downloads\pateint.jpg"
if not os.path.exists(image_path):
    print("Image file does not exist.")# Replace with your actual token
with open(image_path, 'rb') as image_file:
    headers = {
        "Authorization": f"Bearer {hf_access_token}" # type: ignore
    }
    files = {'file': image_file}
    response = requests.post(HF_OCR_API_URL,headers=headers, files=files)

if response.status_code == 200:
    print("OCR Success:", response.json())
else:
    print("OCR API Error:", response.status_code, response.json())
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=8000)
