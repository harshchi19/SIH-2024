import os
import tempfile
import numpy as np
import soundfile as sf
import speech_recognition as sr
from gtts import gTTS
import azure.cognitiveservices.speech as speechsdk

class SpeechProcessor:
    def __init__(self, speech_key, speech_region):
        self.speech_config = speechsdk.SpeechConfig(
            subscription=speech_key,
            region=speech_region
        )
        self.speech_config.speech_synthesis_voice_name = 'en-US-GuyNeural'
        self.chat_history = [
            {"role": "assistant", "content": "Welcome to Vani.AI. How can I assist you with speech therapy today?"}
        ]

    def text_to_speech_azure(self, text: str) -> str:
        """Convert text to speech using Azure cognitive services."""
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_audio_file:
            audio_config = speechsdk.audio.AudioOutputConfig(filename=temp_audio_file.name)
            
            speech_synthesizer = speechsdk.SpeechSynthesizer(
                speech_config=self.speech_config, 
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

    def text_to_speech_gtts(self, text: str) -> str:
        """Convert text to speech using Google Text-to-Speech."""
        tts = gTTS(text, lang='en')
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_file:
            tts.save(temp_file.name)
            return temp_file.name

    def process_audio_file(self, uploaded_file):
        """Process audio file and convert to text."""
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

    def prepare_system_context(self):
        """Prepare system context for AI assistant."""
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