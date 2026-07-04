// Service to route requests to backend or Gemini API directly

const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://korey-inclinatory-extrovertively.ngrok-free.dev';
const BACKEND_ENDPOINTS = ['/api/generate', '/generate', '/v1/generate'];
const DIRECT_MODELS = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

const JSON_SCHEMA = {
  type: 'OBJECT',
  properties: {
    breakfast: {
      type: 'OBJECT',
      properties: {
        name: { type: 'STRING', description: 'Name of the breakfast dish' },
        prepTime: { type: 'INTEGER', description: 'Preparation and cooking time in minutes' },
        instructions: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: 'Step-by-step recipe instructions'
        },
        nutrition: {
          type: 'OBJECT',
          properties: {
            calories: { type: 'INTEGER', description: 'Calories in kcal' },
            protein: { type: 'INTEGER', description: 'Protein in grams' },
            carbs: { type: 'INTEGER', description: 'Carbohydrates in grams' },
            fat: { type: 'INTEGER', description: 'Fats in grams' }
          },
          required: ['calories', 'protein', 'carbs', 'fat']
        },
        ingredientsNeeded: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              name: { type: 'STRING' },
              amount: { type: 'STRING', description: 'Quantity (e.g., 2 eggs, 100g)' },
              category: { type: 'STRING', enum: ['Vegetables', 'Dairy', 'Protein', 'Spices', 'Others'] },
              estimatedCost: { type: 'NUMBER', description: 'Estimated cost in USD' }
            },
            required: ['name', 'amount', 'category', 'estimatedCost']
          }
        },
        timeline: {
          type: 'ARRAY',
          description: 'Action timeline by time block',
          items: {
            type: 'OBJECT',
            properties: {
              time: { type: 'STRING', description: 'e.g., 0-5 mins, 5-15 mins' },
              action: { type: 'STRING', description: 'What to do during this time' }
            },
            required: ['time', 'action']
          }
        }
      },
      required: ['name', 'prepTime', 'instructions', 'nutrition', 'ingredientsNeeded', 'timeline']
    },
    lunch: {
      type: 'OBJECT',
      properties: {
        name: { type: 'STRING', description: 'Name of the lunch dish' },
        prepTime: { type: 'INTEGER', description: 'Preparation and cooking time in minutes' },
        instructions: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: 'Step-by-step recipe instructions'
        },
        nutrition: {
          type: 'OBJECT',
          properties: {
            calories: { type: 'INTEGER' },
            protein: { type: 'INTEGER' },
            carbs: { type: 'INTEGER' },
            fat: { type: 'INTEGER' }
          },
          required: ['calories', 'protein', 'carbs', 'fat']
        },
        ingredientsNeeded: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              name: { type: 'STRING' },
              amount: { type: 'STRING' },
              category: { type: 'STRING', enum: ['Vegetables', 'Dairy', 'Protein', 'Spices', 'Others'] },
              estimatedCost: { type: 'NUMBER' }
            },
            required: ['name', 'amount', 'category', 'estimatedCost']
          }
        },
        timeline: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              time: { type: 'STRING' },
              action: { type: 'STRING' }
            },
            required: ['time', 'action']
          }
        }
      },
      required: ['name', 'prepTime', 'instructions', 'nutrition', 'ingredientsNeeded', 'timeline']
    },
    dinner: {
      type: 'OBJECT',
      properties: {
        name: { type: 'STRING', description: 'Name of the dinner dish' },
        prepTime: { type: 'INTEGER', description: 'Preparation and cooking time in minutes' },
        instructions: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: 'Step-by-step recipe instructions'
        },
        nutrition: {
          type: 'OBJECT',
          properties: {
            calories: { type: 'INTEGER' },
            protein: { type: 'INTEGER' },
            carbs: { type: 'INTEGER' },
            fat: { type: 'INTEGER' }
          },
          required: ['calories', 'protein', 'carbs', 'fat']
        },
        ingredientsNeeded: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              name: { type: 'STRING' },
              amount: { type: 'STRING' },
              category: { type: 'STRING', enum: ['Vegetables', 'Dairy', 'Protein', 'Spices', 'Others'] },
              estimatedCost: { type: 'NUMBER' }
            },
            required: ['name', 'amount', 'category', 'estimatedCost']
          }
        },
        timeline: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              time: { type: 'STRING' },
              action: { type: 'STRING' }
            },
            required: ['time', 'action']
          }
        }
      },
      required: ['name', 'prepTime', 'instructions', 'nutrition', 'ingredientsNeeded', 'timeline']
    },
    groceryList: {
      type: 'ARRAY',
      description: 'Master list of ingredients for the entire day, grouped by category',
      items: {
        type: 'OBJECT',
        properties: {
          ingredient: { type: 'STRING' },
          quantity: { type: 'STRING', description: 'Consolidated quantity for the day' },
          estimatedPurpose: { type: 'STRING', description: 'e.g., Breakfast & Dinner' },
          category: { type: 'STRING', enum: ['Vegetables', 'Dairy', 'Protein', 'Spices', 'Others'] },
          estimatedCost: { type: 'NUMBER', description: 'Estimated cost in USD' }
        },
        required: ['ingredient', 'quantity', 'estimatedPurpose', 'category', 'estimatedCost']
      }
    },
    substitutions: {
      type: 'ARRAY',
      description: 'Suggested swaps for allergies, avoided items, or vegans/vegetarians',
      items: {
        type: 'OBJECT',
        properties: {
          original: { type: 'STRING', description: 'Ingredient to replace' },
          substitution: { type: 'STRING', description: 'Recommended replacement' },
          reason: { type: 'STRING', description: 'Why this substitution is made' }
        },
        required: ['original', 'substitution', 'reason']
      }
    },
    budgetAnalysis: {
      type: 'OBJECT',
      properties: {
        isFeasible: { type: 'BOOLEAN', description: 'Whether the budget is enough to cover the estimated costs' },
        estimatedTotalCost: { type: 'NUMBER', description: 'Total cost of all groceries in USD' },
        remainingBudget: { type: 'NUMBER', description: 'Remaining budget (budget - estimatedTotalCost) in USD' },
        notes: { type: 'STRING', description: 'Detailed budget analysis explanation' },
        cheaperAlternatives: {
          type: 'ARRAY',
          description: 'Recommendations to cut down costs if budget is tight or exceeded',
          items: {
            type: 'OBJECT',
            properties: {
              original: { type: 'STRING', description: 'Expensive item' },
              alternative: { type: 'STRING', description: 'Affordable swap' },
              potentialSavings: { type: 'NUMBER', description: 'Saved amount in USD' }
            },
            required: ['original', 'alternative', 'potentialSavings']
          }
        }
      },
      required: ['isFeasible', 'estimatedTotalCost', 'remainingBudget', 'notes', 'cheaperAlternatives']
    }
  },
  required: ['breakfast', 'lunch', 'dinner', 'groceryList', 'substitutions', 'budgetAnalysis']
};

/**
 * Fallback client-side direct request to Gemini API
 */
const generateDirectGemini = async (params, apiKey) => {
  const systemInstruction = 
    `You are a professional Michelin-star chef, registered dietitian, and financial budget planner.\n` +
    `You create high-quality daily meal plans (Breakfast, Lunch, Dinner), shopping lists, substitutions, and budget analyses.\n` +
    `All responses must strictly adhere to the requested JSON Schema.\n\n` +
    `Rules:\n` +
    `1. Budget Logic:\n` +
    `   - If the estimated grocery cost is <= budget, set isFeasible to true and calculate remainingBudget.\n` +
    `   - If the estimated grocery cost is > budget, set isFeasible to false, and populate cheaperAlternatives with practical swaps.\n` +
    `2. Ingredient categories MUST be one of: 'Vegetables', 'Dairy', 'Protein', 'Spices', 'Others'.\n` +
    `3. Ensure that prepTime for each meal is realistic, and total preparation time does not exceed the user's available time.\n` +
    `4. Respect dietary preferences (${params.dietaryPreference}) and allergies/avoided ingredients (${params.avoidIngredients || 'None'}). If substitutions are made, explain them in the substitutions array.\n` +
    `5. Build detailed cooking timelines detailing specific tasks in chronological order (e.g., "0-5 min: chop onions, 5-15 min: simmer").`;

  const userPrompt = 
    `Generate a daily meal plan with these inputs:\n` +
    `- Serving size: for ${params.people} people\n` +
    `- Daily Budget: $${params.budget} USD\n` +
    `- Dietary preference: ${params.dietaryPreference}\n` +
    `- Cooking goal: ${params.goal}\n` +
    `- Available ingredients to use: ${params.availableIngredients || 'None specified'}\n` +
    `- Allergies/Ingredients to avoid: ${params.avoidIngredients || 'None'}\n` +
    `- Target cooking time: Max ${params.cookingTime} minutes total for the whole day.`;

  const requestBody = {
    contents: [{ parts: [{ text: `${systemInstruction}\n\nUser request:\n${userPrompt}` }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: JSON_SCHEMA,
      temperature: 0.2
    }
  };

  let lastError = null;
  for (const model of DIRECT_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error?.message || `HTTP ${response.status}`;
        lastError = new Error(`Direct Call model ${model} failed: ${message}`);
        continue;
      }

      const responseData = await response.json();
      if (!responseData.candidates || responseData.candidates.length === 0) {
        lastError = new Error(`Direct Call model ${model} returned empty response.`);
        continue;
      }

      const textResponse = responseData.candidates[0].content.parts[0].text;
      return JSON.parse(textResponse);
    } catch (err) {
      console.warn(`Direct call with ${model} failed:`, err.message);
      lastError = err;
    }
  }
  throw lastError || new Error('Direct Gemini API call failed.');
};

/**
 * Main routing function: Tries Ngrok production backend, falls back to direct client call on failure.
 */
export const generateMealPlan = async (params, userApiKey) => {
  const apiKey = userApiKey || import.meta.env.VITE_GEMINI_API_KEY;
  let backendError = null;

  // 1. Try ngrok backend first
  for (const endpoint of BACKEND_ENDPOINTS) {
    try {
      const targetUrl = `${BACKEND_BASE_URL}${endpoint}`;
      console.log(`Routing request to Ngrok backend: ${targetUrl}...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', // Skip ngrok landing page
          'Authorization': apiKey ? `Bearer ${apiKey}` : '',
          'x-api-key': apiKey || ''
        },
        body: JSON.stringify({
          ...params,
          apiKey: apiKey || '',
          api_key: apiKey || ''
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const parsed = await response.json();
        console.log('Backend response generated successfully.');
        return parsed;
      } else {
        const errorText = await response.text().catch(() => '');
        backendError = new Error(`Backend route ${endpoint} returned status ${response.status}: ${errorText.substring(0, 100)}`);
      }
    } catch (err) {
      console.warn(`Ngrok backend endpoint ${endpoint} failed:`, err.message);
      backendError = err;
    }
  }

  // 2. Failover to client-side direct Gemini call if backend failed and API Key is available
  if (apiKey) {
    console.warn('Ngrok production backend is unreachable. Failing over to direct client-side Gemini call...');
    try {
      return await generateDirectGemini(params, apiKey);
    } catch (directError) {
      throw new Error(`Meal plan generation failed: Both the backend server and direct fallback client calls encountered issues. (Backend Error: ${backendError.message}. Direct Error: ${directError.message})`);
    }
  }

  throw new Error(`Production backend server is currently unreachable. Please verify your connection, or enter your Gemini API Key in the configurations panel above to failover to direct generation. (Reason: ${backendError.message})`);
};
