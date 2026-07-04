import logging
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import httpx

from app.config import GEMINI_API_KEY, API_VERSION, NGROK_URL
from app.schemas.schemas import TravelRequest
from app.services.gemini import generate_trip_plan

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("culture_compass")

app = FastAPI(
    title="Culture Compass AI Backend",
    version=API_VERSION,
    description="Backend API for Culture Compass AI Travel Platform"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for the ngrok production deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def check_gemini_connectivity() -> bool:
    if not GEMINI_API_KEY:
        return False
    # Lightweight check: Query models list to verify API key validity without incurring content costs
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={GEMINI_API_KEY}"
    async with httpx.AsyncClient(timeout=5.0) as client:
        try:
            response = await client.get(url)
            return response.status_code == 200
        except Exception as e:
            logger.warning(f"Gemini connectivity check failed: {str(e)}")
            return False

@app.get("/health")
async def health_check():
    gemini_ok = await check_gemini_connectivity()
    return {
        "status": "healthy",
        "api_version": API_VERSION,
        "ngrok_url": NGROK_URL,
        "gemini_api_key_configured": bool(GEMINI_API_KEY),
        "gemini_connectivity": gemini_ok
    }

@app.post("/api/generate")
async def generate_plan(request: TravelRequest):
    # Sanitize user input values to prevent injection
    request.destination = request.destination.strip().replace("\n", " ").replace("\r", "")
    if len(request.destination) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Destination must be at least 2 characters long."
        )

    if request.travelers <= 0:
         raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Number of travelers must be at least 1."
        )

    if request.budget <= 0:
         raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Budget must be greater than 0."
        )

    logger.info(f"Generating travel plan for {request.destination}...")
    try:
        plan = await generate_trip_plan(request)
        return plan
    except Exception as e:
        logger.error(f"Error during trip generation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate travel plan: {str(e)}"
        )
