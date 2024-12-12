import os
import tempfile
from flask import Blueprint, request, jsonify
from openai import OpenAI
from .speech_utils import SpeechProcessor
from .config import Config

main = Blueprint('main', __name__)

# Initialize OpenAI client
client = OpenAI()

# Initialize Speech Processor
speech_processor = SpeechProcessor(
    speech_key=Config.SPEECH_KEY, 
    speech_region=Config.SPEECH_REGION
)

@main.route('/chat', methods=['POST'])
def chat():
    """Handle text-based chat interactions."""
    user_input = request.json.get('message')
    if not user_input:
        return jsonify({"error": "Message content is required"}), 400

    # Append user message to chat history
    speech_processor.chat_history.append({"role": "user", "content": user_input})

    messages = [
        {"role": "system", "content": speech_processor.prepare_system_context()},
        {"role": "user", "content": user_input}
    ]

    try:
        chat_completion = client.chat.completions.create(
            messages=messages,
            model=Config.LLM_MODEL,
            stream=False,
        )
        assistant_reply = chat_completion.choices[0].message.content

        # Append assistant reply to chat history
        speech_processor.chat_history.append({"role": "assistant", "content": assistant_reply})

        return jsonify({
            "assistant_reply": assistant_reply, 
            "chat_history": speech_processor.chat_history
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    """Convert uploaded audio file to text."""
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400
    
    audio_file = request.files['audio']
    
    # Save the file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
        audio_file.save(temp_file.name)
    
    # Process the audio file
    text = speech_processor.process_audio_file(temp_file.name)
    
    # Clean up temporary file
    os.unlink(temp_file.name)
    
    return jsonify({"transcribed_text": text})

@main.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    """Convert text to speech using Azure."""
    text = request.json.get('text')
    if not text:
        return jsonify({"error": "Text is required"}), 400
    
    audio_path = speech_processor.text_to_speech_azure(text)
    
    if audio_path:
        return jsonify({"audio_path": audio_path})
    else:
        return jsonify({"error": "Text-to-speech conversion failed"}), 500