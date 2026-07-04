import os
from dotenv import load_dotenv

# Load env variables from backend/.env if present, otherwise system env
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "0.0.0.0")

# API metadata
API_VERSION = "1.0.0"
NGROK_URL = "https://korey-inclinatory-extrovertively.ngrok-free.dev"
