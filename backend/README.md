# Culture Compass AI - Backend API

Production ready backend architecture utilizing FastAPI, Pydantic, and Google Gemini 2.5 Flash for the Culture Compass AI travel experience.

## Getting Started

1. Create a virtual environment and install requirements:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. Create a `.env` file in the `backend/` directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   PORT=8000
   HOST=0.0.0.0
   ```

3. Launch the FastAPI server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

## Production Endpoints

- **GET `/health`**: Returns backend system health, Gemini API configuration verification, and ngrok URL parameters.
- **POST `/api/generate`**: Expects a `TravelRequest` JSON payload, requests a structured response from Gemini 2.5 Flash, and returns a verified JSON itinerary and guide.
