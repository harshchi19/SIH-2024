from contextlib import asynccontextmanager
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from dotenv import load_dotenv
from services.ocr import generate_pre_therapy
from services.vaniai import text_to_speech, prepare_system_context
from services.matchmaking import extract_text_from_folder, extract_text_from_pdf, compute_cosine_similarity
import base64
import os
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY"), 
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/pre-therapy-report")
async def pre_therapy_report(files: List[UploadFile] = File(...)):
    print("Received files:", files)
    try:
        case_data_list = await generate_pre_therapy(files)
        # case_data_list = []

        if case_data_list:
            return JSONResponse(content={"cases": case_data_list}, status_code=200)

        return JSONResponse(content={"error": "No data extracted"}, status_code=400)
    except Exception as e:
        print("Error in /pre-therapy-report endpoint:", str(e))
        return JSONResponse(content={"Error": str(e)}, status_code=500)

@app.post("/chat-with-bot")
async def chat_with_bot(
    message: Optional[str] = Form(None),
):  
    try:
        if message:
            user_input = message
        else:
            return JSONResponse(content={"error": "No input provided"}, status_code=400)
        chat_history = []   

        chat_history.append({"role": "user", "content": user_input})
        messages = [
            {"role": "system", "content": prepare_system_context()},
            {"role": "user", "content": user_input}
        ]

        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama3-8b-8192",
            stream=False,
        )
        assistant_reply = chat_completion.choices[0].message.content
        chat_history.append({"role": "assistant", "content": assistant_reply})

        # speech_file_path = text_to_speech_azure(assistant_reply)
        speech_file_path = await text_to_speech(assistant_reply)

        if speech_file_path:
            with open(speech_file_path, "rb") as audio_file:
                audio_base64 = base64.b64encode(audio_file.read()).decode("utf-8")
            
            os.unlink(speech_file_path)

            return JSONResponse(
                content={
                    "assistant_reply": assistant_reply,
                    "audio_file": audio_base64, 
                }
            )
        else:
            return JSONResponse(content={"error": "Failed to synthesize speech."}, status_code=500)

    except Exception as e:
        print("Error in /chat-with-bot endpoint:", str(e))
        return JSONResponse(content={"Error": str(e)}, status_code=500)
    
# For matching student therapists to patients
@app.post("/match-therapists")
async def match_therapists(pdf_file: UploadFile = File(...)) -> JSONResponse:
    """
    Match patient details (uploaded PDF) with therapist data based on cosine similarity.
    """
    try:
        # Extract text from uploaded PDF file
        extracted_text = extract_text_from_pdf(pdf_file.file)

        # Define the folder path where therapist PDFs are stored
        folder_path = "therapist_data"
        if not os.path.exists(folder_path):
            raise HTTPException(status_code=404, detail=f"The folder '{folder_path}' does not exist.")

        # Extract texts from all therapist PDFs
        extracted_therapist_data = extract_text_from_folder(folder_path)

        # Calculate cosine similarity
        similarities = []
        for filename, text in extracted_therapist_data.items():
            similarity_score = compute_cosine_similarity(extracted_text, text)
            similarities.append({"filename": filename, "similarity": similarity_score})

        # Sort the similarities in descending order
        similarities.sort(key=lambda x: x["similarity"], reverse=True)

        # Return top 3 matches
        top_matches = similarities[:3]
        return JSONResponse(content={"matches": top_matches}, status_code=200)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
