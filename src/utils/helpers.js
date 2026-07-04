export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
};

export const copyToClipboard = async (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return await navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch (err) {
      document.body.removeChild(textarea);
      throw err;
    }
  }
};

export const formatMealPlanAsText = (plan) => {
  if (!plan) return '';

  let output = `🍳 DAILY MEAL PLAN & COOKING TO-DO LIST\n`;
  output += `========================================\n\n`;

  // Breakfast
  if (plan.breakfast) {
    output += `🌅 BREAKFAST: ${plan.breakfast.name} (${plan.breakfast.prepTime} mins)\n`;
    output += `Nutrition: Calories: ${plan.breakfast.nutrition?.calories} kcal | Protein: ${plan.breakfast.nutrition?.protein}g | Carbs: ${plan.breakfast.nutrition?.carbs}g | Fat: ${plan.breakfast.nutrition?.fat}g\n\n`;
    output += `🛒 Ingredients Needed:\n`;
    plan.breakfast.ingredientsNeeded?.forEach(ing => {
      output += `- [ ] ${ing.name} (${ing.amount}) - Est: ${formatCurrency(ing.estimatedCost)}\n`;
    });
    output += `\n📝 Instructions:\n`;
    plan.breakfast.instructions?.forEach((step, idx) => {
      output += `${idx + 1}. ${step}\n`;
    });
    output += `\n⏱️ Cooking Timeline:\n`;
    plan.breakfast.timeline?.forEach(step => {
      output += `- ${step.time}: ${step.action}\n`;
    });
    output += `\n----------------------------------------\n\n`;
  }

  // Lunch
  if (plan.lunch) {
    output += `☀️ LUNCH: ${plan.lunch.name} (${plan.lunch.prepTime} mins)\n`;
    output += `Nutrition: Calories: ${plan.lunch.nutrition?.calories} kcal | Protein: ${plan.lunch.nutrition?.protein}g | Carbs: ${plan.lunch.nutrition?.carbs}g | Fat: ${plan.lunch.nutrition?.fat}g\n\n`;
    output += `🛒 Ingredients Needed:\n`;
    plan.lunch.ingredientsNeeded?.forEach(ing => {
      output += `- [ ] ${ing.name} (${ing.amount}) - Est: ${formatCurrency(ing.estimatedCost)}\n`;
    });
    output += `\n📝 Instructions:\n`;
    plan.lunch.instructions?.forEach((step, idx) => {
      output += `${idx + 1}. ${step}\n`;
    });
    output += `\n⏱️ Cooking Timeline:\n`;
    plan.lunch.timeline?.forEach(step => {
      output += `- ${step.time}: ${step.action}\n`;
    });
    output += `\n----------------------------------------\n\n`;
  }

  // Dinner
  if (plan.dinner) {
    output += `🌙 DINNER: ${plan.dinner.name} (${plan.dinner.prepTime} mins)\n`;
    output += `Nutrition: Calories: ${plan.dinner.nutrition?.calories} kcal | Protein: ${plan.dinner.nutrition?.protein}g | Carbs: ${plan.dinner.nutrition?.carbs}g | Fat: ${plan.dinner.nutrition?.fat}g\n\n`;
    output += `🛒 Ingredients Needed:\n`;
    plan.dinner.ingredientsNeeded?.forEach(ing => {
      output += `- [ ] ${ing.name} (${ing.amount}) - Est: ${formatCurrency(ing.estimatedCost)}\n`;
    });
    output += `\n📝 Instructions:\n`;
    plan.dinner.instructions?.forEach((step, idx) => {
      output += `${idx + 1}. ${step}\n`;
    });
    output += `\n⏱️ Cooking Timeline:\n`;
    plan.dinner.timeline?.forEach(step => {
      output += `- ${step.time}: ${step.action}\n`;
    });
    output += `\n----------------------------------------\n\n`;
  }

  // Grocery shopping list
  if (plan.groceryList && plan.groceryList.length > 0) {
    output += `🛒 COMPLETE GROCERY LIST:\n`;
    const grouped = {};
    plan.groceryList.forEach(item => {
      const cat = item.category || 'Others';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    Object.keys(grouped).forEach(cat => {
      output += `\n[${cat.toUpperCase()}]\n`;
      grouped[cat].forEach(item => {
        output += `- [ ] ${item.ingredient} (${item.quantity}) - Purpose: ${item.estimatedPurpose} - Est: ${formatCurrency(item.estimatedCost)}\n`;
      });
    });
    output += `\n----------------------------------------\n\n`;
  }

  // Ingredient substitutions
  if (plan.substitutions && plan.substitutions.length > 0) {
    output += `🔄 INGREDIENT SUBSTITUTIONS:\n`;
    plan.substitutions.forEach(sub => {
      output += `- Swap "${sub.original}" with "${sub.substitution}" (${sub.reason})\n`;
    });
    output += `\n----------------------------------------\n\n`;
  }

  // Budget Analysis
  if (plan.budgetAnalysis) {
    output += `💰 BUDGET FEASIBILITY ANALYSIS:\n`;
    output += `Feasible? ${plan.budgetAnalysis.isFeasible ? '✅ YES' : '❌ NO'}\n`;
    output += `Estimated Total Cost: ${formatCurrency(plan.budgetAnalysis.estimatedTotalCost)}\n`;
    output += `Remaining Budget: ${formatCurrency(plan.budgetAnalysis.remainingBudget)}\n`;
    output += `Analysis: ${plan.budgetAnalysis.notes || ''}\n`;
    if (plan.budgetAnalysis.cheaperAlternatives && plan.budgetAnalysis.cheaperAlternatives.length > 0) {
      output += `\n💡 Cheaper Alternatives suggested by AI:\n`;
      plan.budgetAnalysis.cheaperAlternatives.forEach(alt => {
        output += `- Substitute "${alt.original}" with "${alt.alternative}" (Saves ~${formatCurrency(alt.potentialSavings)})\n`;
      });
    }
  }

  return output;
};
