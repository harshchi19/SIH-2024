from contextlib import asynccontextmanager
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from dotenv import load_dotenv
from services.ocr import generate_pre_therapy
from services.vaniai import text_to_speech, prepare_system_context, process_audio_file, text_to_speech_azure
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
    allow_headers=["*"], 
    expose_headers=["X-Assistant-Reply"]
)

@app.post("/pre-therapy-report")
async def pre_therapy_report(file: UploadFile = File(...)):
    try:
        case_data = generate_pre_therapy(file)

        if isinstance(case_data, dict):
            return JSONResponse(content=case_data, status_code=200)

        return StreamingResponse(case_data)
    except Exception as e:
        print("Error in /pre-therapy-report endpoint:", str(e))
        return JSONResponse(content={"Error": str(e)}, status_code=500)

@app.post("/chat-with-bot")
async def chat_with_bot(
    message: Optional[str] = Form(None),
):  
    print(message)
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
        speech_file_path = text_to_speech(assistant_reply)

        if speech_file_path:
            with open(speech_file_path, "rb") as audio_file:
                audio_base64 = base64.b64encode(audio_file.read()).decode("utf-8")

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
