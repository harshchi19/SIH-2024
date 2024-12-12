from contextlib import asynccontextmanager
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from dotenv import load_dotenv
from services.ocr import generate_pre_therapy
from services.vaniai import text_to_speech, prepare_system_context
from services.matchmaking import extract_text_from_folder, extract_text_from_pdf, compute_cosine_similarity
from services.blogs_yt import fetch_news_articles, fetch_youtube_videos
import base64
import os
from groq import Groq
from azure.storage.blob import BlobServiceClient
import traceback

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
    
# For matching student therapists and supervisors to patients
@app.post("/matchmaking")
async def match_therapists(patient_id: Optional[str] = Form(None)) -> JSONResponse:
    """
    Match patient details (uploaded PDF) with therapist data based on cosine similarity.
    """
    
    try:
        blob_service_client = BlobServiceClient.from_connection_string(os.getenv("CONNECTION_STRING"))
        container_client = blob_service_client.get_container_client("patients-container")

        blob_name = f"{patient_id}_patient_details.pdf"

        blob_client = container_client.get_blob_client(blob_name)

        if not blob_client.exists():
            raise HTTPException(status_code=404, detail="PDF file not found.")
        
        blob_data = blob_client.download_blob().readall()

        extracted_text = extract_text_from_pdf(blob_data)

        extracted_supervisor_data = extract_text_from_folder(os.getenv("AZURE_SUPERVISORS_CONTAINER"))

        # Extract texts from all therapist PDFs
        extracted_student_therapist_data = extract_text_from_folder(os.getenv("AZURE_THERAPIST_CONTAINER"))

        # Calculate cosine similarity
        supervisor_similarities = []
        for filename, text in extracted_supervisor_data.items():
            similarity_score = compute_cosine_similarity(extracted_text, text)
            supervisor_similarities.append({"filename": filename, "similarity": similarity_score})

        student_therapist_similarities = []
        for filename, text in extracted_student_therapist_data.items():
            similarity_score = compute_cosine_similarity(extracted_text, text)
            student_therapist_similarities.append({"filename": filename, "similarity": similarity_score})

        # Sort the similarities in descending order
        supervisor_similarities.sort(key=lambda x: x["similarity"], reverse=True)
        student_therapist_similarities.sort(key=lambda x: x["similarity"], reverse=True)

        # Return top 3 matches
        response = {
            "supervisors": supervisor_similarities[:5],
            "student_therapists": student_therapist_similarities[:5]
        }

        return JSONResponse(content=response, status_code=200)

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error: {error_trace}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/blogs-youtube')
def search(message: Optional[str] = Form(None), type: Optional[str] = Form(None)):
    print(message, type)
    try:
        if not message:
            return JSONResponse(content={"error": "Message is required"}, status_code=400)
        
        result = {}
        
        # Fetch results based on type
        if type == "youtube":
            result["youtube_videos"] = fetch_youtube_videos(message)
        elif type == "news":
            result["news_articles"] = fetch_news_articles(message)
        else:
            return JSONResponse(content={"error": "Invalid type. Use 'youtube' or 'news'."}, status_code=400)

        # Return results in JSON format
        return JSONResponse(content={"message": message, **result}, status_code=200)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)