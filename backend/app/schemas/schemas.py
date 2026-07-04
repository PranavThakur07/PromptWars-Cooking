from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class TravelRequest(BaseModel):
    destination: str = Field(..., description="Target destination of the trip")
    startDate: str = Field(..., description="Start date of the trip, e.g. '2026-07-10'")
    endDate: str = Field(..., description="End date of the trip, e.g. '2026-07-15'")
    budget: float = Field(..., description="Total travel budget in USD")
    travelers: int = Field(..., description="Number of travelers")
    travelStyle: str = Field(..., description="Solo, Family, Couple, Friends, or Business")
    interests: List[str] = Field(..., description="List of interest tags, e.g., ['Food', 'History', 'Nature']")
    accessibilityNeeds: Optional[str] = Field("None", description="Accessibility requirements")
    languages: Optional[str] = Field("English", description="Preferred languages spoken or understood")

class ItineraryActivity(BaseModel):
    time: str = Field(..., description="Time block of the day, e.g., '09:00 AM - 11:30 AM' or 'Afternoon'")
    activityName: str = Field(..., description="Name of the activity or attraction")
    description: str = Field(..., description="Immersive, experience-focused storytelling details")
    location: str = Field(..., description="Specific address or site landmark name")
    latitude: float = Field(..., description="Estimated decimal latitude of the attraction")
    longitude: float = Field(..., description="Estimated decimal longitude of the attraction")
    cost: float = Field(..., description="Estimated cost in USD")

class HiddenGem(BaseModel):
    name: str = Field(..., description="Name of the hidden gem")
    description: str = Field(..., description="Experience-oriented storytelling details")
    location: str = Field(..., description="Specific area or address")
    latitude: float = Field(..., description="Decimal latitude")
    longitude: float = Field(..., description="Decimal longitude")
    whyUnique: str = Field(..., description="Why tourists rarely discover this spot")

class HeritageItem(BaseModel):
    name: str = Field(..., description="Name of the heritage site/activity")
    description: str = Field(..., description="Cultural value, backstory, or historical significance")
    location: str = Field(..., description="Specific landmark address")
    latitude: float = Field(..., description="Decimal latitude")
    longitude: float = Field(..., description="Decimal longitude")
    significance: str = Field(..., description="Why this site matters locally")

class FoodRecommendation(BaseModel):
    name: str = Field(..., description="Name of the dish")
    restaurantName: str = Field(..., description="Recommended restaurant or street market vendor")
    description: str = Field(..., description="Flavor profile, local pairing, and experience details")
    priceEstimate: float = Field(..., description="Estimated price in USD")
    culturalSignificance: str = Field(..., description="Historical or local significance of the dish")
    vegetarianOptions: bool = Field(..., description="Whether a vegetarian option is available")
    latitude: float = Field(..., description="Decimal latitude of restaurant")
    longitude: float = Field(..., description="Decimal longitude of restaurant")

class LocalEvent(BaseModel):
    name: str = Field(..., description="Name of event/festival")
    description: str = Field(..., description="Details and vibe of the event")
    type: str = Field(..., description="Event type, e.g. festival, performance, street market")
    location: str = Field(..., description="Event location venue")
    latitude: float = Field(..., description="Decimal latitude")
    longitude: float = Field(..., description="Decimal longitude")

class CulturalEtiquette(BaseModel):
    greetings: str = Field(..., description="Common phrases and gestures for greeting")
    customs: str = Field(..., description="General customs to respect")
    dress: str = Field(..., description="Local dress requirements or taboos")
    photographyRules: str = Field(..., description="Rules on photography (especially around temples/heritage)")
    dos: List[str] = Field(..., description="Behavior list of what you should do")
    donts: List[str] = Field(..., description="Behavior list of what to avoid")
    tipping: str = Field(..., description="Tipping expectations in restaurants and services")
    safety: str = Field(..., description="Specific safety advice or contact info")

class BudgetCostItem(BaseModel):
    estimatedTotalCost: float = Field(..., description="Total estimated cost of the recommended trip in USD")
    transport: float = Field(..., description="Transport cost breakdown")
    food: float = Field(..., description="Food cost breakdown")
    tickets: float = Field(..., description="Sightseeing tickets cost breakdown")
    shopping: float = Field(..., description="Shopping allowance suggestion")
    miscellaneous: float = Field(..., description="Misc buffer cost")
    remainingBudget: float = Field(..., description="Input budget minus total cost in USD")
    isFeasible: bool = Field(..., description="True if total estimated cost <= input budget")
    warnings: List[str] = Field(..., description="Budget alerts/advice (e.g. 'Highly expensive dining')")
    cheaperAlternatives: List[str] = Field(..., description="Specific actionable steps to save costs")

class LocalPhrase(BaseModel):
    phrase: str = Field(..., description="Local wording")
    pronunciation: str = Field(..., description="Phonetic translation for pronouncing")
    meaning: str = Field(..., description="Meaning in English")
    usageExample: str = Field(..., description="When to use this phrase")

class TravelResponse(BaseModel):
    story: str = Field(..., description="A rich storytelling narrative introducing the journey to this destination")
    itinerary: Dict[str, List[ItineraryActivity]] = Field(..., description="Day-by-day timeline, e.g. {'Day 1': [...], 'Day 2': [...]}")
    hiddenGems: List[HiddenGem] = Field(..., description="Secret, off-the-beaten-path locations")
    heritage: List[HeritageItem] = Field(..., description="Important cultural heritage spots")
    food: List[FoodRecommendation] = Field(..., description="Authentic dish recommendations and dining locations")
    events: List[LocalEvent] = Field(..., description="Local events, seasonal performance, or markets")
    culture: CulturalEtiquette = Field(..., description="Customs, dress, tipping, safety guidelines")
    budget: BudgetCostItem = Field(..., description="Financial details, transport, tickets, savings advice")
    packing: List[str] = Field(..., description="Consolidated list of packing checklist (documents, electronics, clothing, medicine)")
    localPhrases: List[LocalPhrase] = Field(..., description="Basic phrasebook with pronunciations and meanings")
    travelJournal: str = Field(..., description="Daily travel journal, memories summary, and shareable travel postcard content")
    instagramCaption: str = Field(..., description="Vibrant social media caption with emojis and hashtags")
    safetyTips: List[str] = Field(..., description="Detailed safety and local hazard warnings")
