import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Azure Speech Configuration
    SPEECH_KEY = os.getenv('SPEECH_KEY')
    SPEECH_REGION = os.getenv('SPEECH_REGION')
    
    # OpenAI or other LLM Configuration
    LLM_MODEL = os.getenv('LLM_MODEL', 'llama3-8b-8192')
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key_here')
    DEBUG = True