# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os
# from dotenv import load_dotenv
# import tempfile
# import azure.cognitiveservices.speech as speechsdk
# import speech_recognition as sr
# import soundfile as sf
# import numpy as np
# from gtts import gTTS
# from lib.models.services.vaniai import text_to_speech_azure, speech_to_text_azure
# from lib.models.services.vaniai import text_to_speech_azure as azure_text_to_speech
# from lib.models.services.vaniai import speech_to_text_azure as azure_speech_to_text

# app = Flask(__name__)
# CORS(app)
# load_dotenv()

# speech_config = speechsdk.SpeechConfig(
#     subscription=os.environ.get('SPEECH_KEY'),
#     region=os.environ.get('SPEECH_REGION')
# )
# speech_config.speech_synthesis_voice_name = 'en-US-GuyNeural'

# @app.route('/text-to-speech', methods=['POST'])
# def text_to_speech_route():
#     data = request.json
#     text = data.get('text', '')
#     file_path = text_to_speech_azure(text)
#     if file_path:
#         return jsonify({"file_path": file_path}), 200
#     return jsonify({"error": "Speech synthesis failed"}), 500

# @app.route('/speech-to-text', methods=['POST'])
# def speech_to_text_route():
#     if 'audio_file' not in request.files:
#         return jsonify({"error": "Audio file is required"}), 400

#     audio_file = request.files['audio_file']
#     with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
#         audio_file.save(temp_file.name)

#     text = speech_to_text(temp_file.name)
#     return jsonify({"transcription": text}), 200

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import tempfile
from ..models.services.vaniai import speech_to_text, text_to_speech_azure

app = Flask(__name__)
CORS(app)
load_dotenv()

@app.route('/text-to-speech', methods=['POST'])
def text_to_speech_route():
    data = request.json
    text = data.get('text', '')
    file_path = text_to_speech_azure(text)
    if file_path:
        return jsonify({"file_path": file_path}), 200
    return jsonify({"error": "Speech synthesis failed"}), 500

@app.route('/speech-to-text', methods=['POST'])
def speech_to_text_route():
    if 'audio_file' not in request.files:
        return jsonify({"error": "Audio file is required"}), 400

    audio_file = request.files['audio_file']
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
        audio_file.save(temp_file.name)

    text = speech_to_text(temp_file.name)
    return jsonify({"transcription": text}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
