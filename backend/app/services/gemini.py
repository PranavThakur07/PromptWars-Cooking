import httpx
import json
import logging
from typing import Dict, Any
from app.config import GEMINI_API_KEY
from app.schemas.schemas import TravelRequest, TravelResponse

logger = logging.getLogger("culture_compass")

def dereference_schema(schema: dict) -> dict:
    """
    Resolves and inlines all Pydantic $defs/$ref definitions because Gemini
    does not support external references in response_schema.
    Also strips out unsupported OpenAPI keys like 'additionalProperties', 'title', and 'default'.
    """
    defs = schema.get("$defs", {})
    
    def resolve(node):
        if isinstance(node, dict):
            if "$ref" in node:
                ref_path = node["$ref"]
                def_name = ref_path.split("/")[-1]
                return resolve(defs[def_name])
            return {k: resolve(v) for k, v in node.items() if k not in ["title", "default", "additionalProperties"]}
        elif isinstance(node, list):
            return [resolve(x) for x in node]
        return node

    resolved = resolve(schema)
    if "$defs" in resolved:
        del resolved["$defs"]
    if "title" in resolved:
        del resolved["title"]
    return resolved

async def generate_trip_plan(request: TravelRequest) -> Dict[str, Any]:
    """
    Generates a complete travel plan from Gemini in a single API call using a strict JSON schema.
    """
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured on the backend server.")

    # Format the prompt
    interests_str = ", ".join(request.interests)
    prompt = (
        f"Generate a rich, culture-focused travel plan for {request.destination}.\n"
        f"Trip Details:\n"
        f"- Dates: from {request.startDate} to {request.endDate}\n"
        f"- Number of travelers: {request.travelers}\n"
        f"- Travel Style: {request.travelStyle}\n"
        f"- Total Budget: ${request.budget} USD\n"
        f"- Travelers' Interests: {interests_str}\n"
        f"- Accessibility Needs: {request.accessibilityNeeds}\n"
        f"- Language Preferences: {request.languages}\n\n"
        f"Requirements:\n"
        f"1. Generate ONE structured JSON response containing the entire travel guide.\n"
        f"2. Every attraction, gem, food stall/restaurant, and event MUST have realistic decimal coordinates (latitude and longitude) matching its actual geographical location so it can be mapped.\n"
        f"3. All descriptions must focus on storytelling and immersive experiences rather than just generic lists of facts.\n"
        f"4. The budget breakdown must calculate transportation, food, tickets, shopping, and miscellaneous, verify feasibility against the input budget, and suggest specific cheaper alternatives if over budget."
    )

    system_instruction = (
        "You are an elite, highly experienced global travel curator, cultural anthropologist, and local guide.\n"
        "Your mission is to help travelers discover destinations deeply, offering immersive storytelling about local history, "
        "hidden gems that tourists rarely see, authentic local food stalls/street markets/traditional restaurants, cultural etiquette guidelines, "
        "phrasebooks, budgets, and packing lists.\n"
        "You must return a single JSON object strictly matching the provided schema, with no markdown code blocks or wrapper text."
    )

    # Resolve schema
    raw_schema = TravelResponse.model_json_schema()
    clean_schema = dereference_schema(raw_schema)

    # API Request configuration
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "systemInstruction": {
            "parts": [
                {"text": system_instruction}
            ]
        },
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": clean_schema,
            "temperature": 0.2
        }
    }

    headers = {"Content-Type": "application/json"}

    async with httpx.AsyncClient(timeout=90.0) as client:
        try:
            logger.info("Sending request to Gemini 2.5 Flash API...")
            response = await client.post(url, json=payload, headers=headers)
            
            if response.status_code != 200:
                error_body = response.text
                logger.error(f"Gemini API returned status {response.status_code}: {error_body}")
                raise Exception(f"Gemini API Error (status {response.status_code}): {error_body}")

            result = response.json()
            candidates = result.get("candidates", [])
            if not candidates:
                raise Exception("Gemini API returned empty candidates list.")

            content_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            if not content_text:
                raise Exception("No content returned from Gemini parts.")

            # Validate output matches response format by loading as JSON
            parsed_json = json.loads(content_text)
            
            # Double check required fields exist (or fill default)
            required_keys = ["story", "itinerary", "hiddenGems", "heritage", "food", "events", "culture", "budget", "packing", "localPhrases", "travelJournal", "instagramCaption"]
            for key in required_keys:
                if key not in parsed_json:
                    logger.warning(f"Key '{key}' was missing from Gemini response. Filling blank default.")
                    if key in ["itinerary", "culture", "budget"]:
                        parsed_json[key] = {}
                    elif key in ["hiddenGems", "heritage", "food", "events", "packing", "localPhrases"]:
                        parsed_json[key] = []
                    else:
                        parsed_json[key] = ""

            return parsed_json

        except httpx.TimeoutException as e:
            logger.error("Gemini API request timed out.")
            raise Exception("Gemini API Request Timed Out. Please try again.")
        except Exception as e:
            logger.error(f"Error calling Gemini: {str(e)}")
            raise e
