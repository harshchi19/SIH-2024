import os
from dotenv import load_dotenv
from gtts import gTTS
import speech_recognition as sr
import tempfile
from io import BytesIO
import soundfile as sf
import numpy as np
import azure.cognitiveservices.speech as speechsdk

load_dotenv()

# In-memory chat history storage
chat_history = [
    {"role": "assistant", "content": "Welcome to Vani.AI. How can I assist you with speech therapy today?"}
]

speech_config = speechsdk.SpeechConfig(
    subscription=os.environ.get('SPEECH_KEY'), 
    region=os.environ.get('SPEECH_REGION')
)

speech_config.speech_synthesis_voice_name = 'en-US-GuyNeural'

def text_to_speech_azure(text: str) -> str:
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_audio_file:
        audio_config = speechsdk.audio.AudioOutputConfig(filename=temp_audio_file.name)
        
        speech_synthesizer = speechsdk.SpeechSynthesizer(
            speech_config=speech_config, 
            audio_config=audio_config
        )

        speech_synthesis_result = speech_synthesizer.speak_text_async(text).get()

        if speech_synthesis_result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            print(f"Speech synthesized for text: {text}")
            return temp_audio_file.name
        else:
            cancellation_details = speech_synthesis_result.cancellation_details
            print(f"Speech synthesis canceled: {cancellation_details.reason}")
            if cancellation_details.reason == speechsdk.CancellationReason.Error:
                print(f"Error details: {cancellation_details.error_details}")
            return None

# Function to convert text to speech
def text_to_speech(text):
    tts = gTTS(text, lang='en')
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_file:
        tts.save(temp_file.name)
        return temp_file.name

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
    You are Vani.AI, a specialized speech therapy assistant for the Ali Javar Yung Institute.
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

# Route for handling text input
def chat():
    user_input = request.json.get('message')
    if not user_input:
        return jsonify({"error": "Message content is required"}), 400

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

    return jsonify({"assistant_reply": assistant_reply, "chat_history": chat_history})

def process_audio_file(uploaded_file):
    data, samplerate = sf.read(uploaded_file)
    
    if len(data.shape) > 1:
        data = data.mean(axis=1)
    
    data = (data * 32767).astype(np.int16)
    
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_wav:
        sf.write(temp_wav.name, data, samplerate)
    
    recognizer = sr.Recognizer()
    with sr.AudioFile(temp_wav.name) as source:
        audio = recognizer.record(source)
    
    try:
        text = recognizer.recognize_google(audio)
        return text
    except sr.UnknownValueError:
        return "Sorry, could not understand the audio. Please try again."
    except sr.RequestError:
        return "Error with the speech recognition service."