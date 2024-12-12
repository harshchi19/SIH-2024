import os
from dotenv import load_dotenv
import speech_recognition as sr
import tempfile
from io import BytesIO
import edge_tts

load_dotenv()

# In-memory chat history storage
chat_history = [
    {"role": "assistant", "content": "Welcome to Vani.AI. How can I assist you with speech therapy today?"}
]

# Function to convert text to speech
async def text_to_speech(text):
    try:
        # Create a temporary file to store the audio
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_audio:
            temp_audio_path = temp_audio.name
            # Initialize edge-tts with a male voice
            communicate = edge_tts.Communicate(text, 'en-US-ChristopherNeural')
            
            # Generate audio and save to temporary file
            await communicate.save(temp_audio_path)
        
        return temp_audio_path
            
    except Exception as e:
        print(f"Error generating speech: {str(e)}")
        return None

# Function to recognize speech (convert speech to text)
def speech_to_text(audio_file_path):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file_path) as source:
        audio = recognizer.record(source)
    try:
        return recognizer.recognize_google(audio)
    except sr.UnknownValueError:
        return "Sorry, I didn't catch that. Please try again."
    except sr.RequestError:
        return "There was an error with the speech recognition service."

# Fine-tuning context for Vani.AI
def prepare_system_context():
    return """
    You are vani.ai, a specialized speech therapy assistant for the Ali Javar Yung Institute.
    Your responses should be concise, to the point, and professional, in 2-3 sentences.
    Key responsibilities:
    1. Provide supportive and professional speech therapy guidance
    2. Help with patient assessment and treatment recommendations
    3. Maintain a compassionate and patient-centered approach
    4. Assist in generating digital case files and treatment plans

    Project VaniVikas focuses on:
    - Smart patient-therapist allocation
    - Digital case file management
    - OCR-based physical file conversion
    - Digital patient onboarding
    - Custom treatment planning
    - Session report generation
    - Supervisor report approval process
    """