// Frontend API Service to communicate with FastAPI Backend

const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://korey-inclinatory-extrovertively.ngrok-free.dev';

/**
 * Sends inputs to backend to generate travel plan
 * @param {Object} params - inputs from FormSection
 * @returns {Promise<Object>} structured itinerary details
 */
export const generateTravelPlan = async (params) => {
  const targetUrl = `${BACKEND_BASE_URL}/api/generate`;
  console.log(`Sending travel plan request to backend endpoint: ${targetUrl}...`);

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true' // Skip ngrok landing page
    },
    body: JSON.stringify({
      destination: params.destination,
      startDate: params.startDate,
      endDate: params.endDate,
      budget: parseFloat(params.budget),
      travelers: parseInt(params.travelers, 10),
      travelStyle: params.travelStyle,
      interests: params.interests,
      accessibilityNeeds: params.accessibilityNeeds || 'None',
      languages: params.languages || 'English'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorDetail = `Status ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorDetail = errorJson.detail || errorDetail;
    } catch (_) {
      errorDetail = errorText.substring(0, 100) || errorDetail;
    }
    throw new Error(errorDetail);
  }

  const travelData = await response.json();
  console.log('Successfully received travel plan from backend.');
  return travelData;
};

/**
 * Checks server health status
 * @returns {Promise<Object>} health metrics
 */
export const checkBackendHealth = async () => {
  const targetUrl = `${BACKEND_BASE_URL}/health`;
  const response = await fetch(targetUrl, {
    headers: {
      'ngrok-skip-browser-warning': 'true'
    }
  });
  if (!response.ok) {
    throw new Error(`Health status check failed with status ${response.status}`);
  }
  return await response.json();
};
