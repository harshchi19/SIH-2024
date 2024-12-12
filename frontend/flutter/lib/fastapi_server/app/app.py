import uvicorn
import os
import asyncio
import tempfile
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq
import speech_recognition as sr
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import tempfile

# Load environment variables
load_dotenv()

# Initialize the FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Store chat history and context in memory
messages = [{"role": "assistant", "content": "Welcome to Vani.AI. How can I assist you with speech therapy today?"}]
conversation_context = []

class UserInput(BaseModel):
    user_input: str

messages = [{"role": "assistant", "content": "Welcome to Vani.AI. How can I assist you with speech therapy today?"}]
conversation_context = []

def update_conversation_context(user_message, assistant_reply):
    if len(conversation_context) >= 10:
        conversation_context.pop(0)
    conversation_context.append({"user": user_message, "assistant": assistant_reply})

def prepare_system_context():
    base_context = """
    You are Vani.AI, a specialized speech therapy assistant.
    Your responses should be concise and professional.
    Previous Conversation Context:
    """
    context_history = "\n".join([f"User: {exchange['user']}\nAssistant: {exchange['assistant']}" for exchange in conversation_context])
    return base_context + context_history

async def text_to_speech(text):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_audio:
            temp_audio_path = temp_audio.name
            communicate = edge_tts.Communicate(text, 'en-US-ChristopherNeural')
            await communicate.save(temp_audio_path)
        return temp_audio_path
    except Exception as e:
        return None

@app.post("/upload-audio/")
async def upload_audio(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
            temp_audio.write(await file.read())
            temp_audio_path = temp_audio.name

        recognizer = sr.Recognizer()
        with sr.AudioFile(temp_audio_path) as source:
            audio = recognizer.record(source)
        speech_text = recognizer.recognize_google(audio)
        os.remove(temp_audio_path)

        # Process the chat completion
        chat_completion = client.chat.completions.create(
            messages=[{"role": "system", "content": prepare_system_context()},
                      {"role": "user", "content": speech_text}],
            model="llama3-8b-8192",
            stream=False,
        )
        assistant_reply = chat_completion.choices[0].message.content
        messages.append({"role": "user", "content": speech_text})
        messages.append({"role": "assistant", "content": assistant_reply})
        update_conversation_context(speech_text, assistant_reply)

        return {"response": assistant_reply}
    except Exception as e:
        return {"error": str(e)}

@app.post("/text/")
async def text_input(input_data: UserInput):
    user_input = input_data.user_input
    messages.append({"role": "user", "content": user_input})

    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
        temp_audio_path = temp_audio.name

    chat_completion = client.chat.completions.create(
        messages=[{"role": "system", "content": prepare_system_context()},
                  {"role": "user", "content": user_input}],
        model="llama3-8b-8192",
        stream=False,
    )
    assistant_reply = chat_completion.choices[0].message.content
    messages.append({"role": "assistant", "content": assistant_reply})
    update_conversation_context(user_input, assistant_reply)

    return {"response": assistant_reply}

@app.get("/chat-history/")
async def get_chat_history():
    return messages

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)