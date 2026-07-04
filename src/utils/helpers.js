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

export const formatTravelPlanAsText = (plan, destination) => {
  if (!plan) return '';

  let output = `🧭 CULTURE COMPASS AI - TRAVEL GUIDE FOR ${destination.toUpperCase()}\n`;
  output += `==========================================================\n\n`;

  // Story
  if (plan.story) {
    output += `✨ IMMERSIVE STORYTELLING:\n`;
    output += `"${plan.story}"\n\n`;
    output += `----------------------------------------------------------\n\n`;
  }

  // Itinerary
  if (plan.itinerary) {
    output += `📅 DAILY ITINERARY:\n`;
    Object.entries(plan.itinerary).sort().forEach(([day, activities]) => {
      output += `\n[${day.toUpperCase()}]\n`;
      activities.forEach(act => {
        output += `- ${act.time}: ${act.activityName} - ${act.location}\n`;
        output += `  "${act.description}"\n`;
        if (act.cost > 0) output += `  Estimated Cost: ${formatCurrency(act.cost)}\n`;
      });
    });
    output += `\n----------------------------------------------------------\n\n`;
  }

  // Hidden Gems
  if (plan.hiddenGems && plan.hiddenGems.length > 0) {
    output += `💎 HIDDEN GEMS:\n`;
    plan.hiddenGems.forEach(gem => {
      output += `- ${gem.name} (${gem.location})\n`;
      output += `  "${gem.description}"\n`;
      output += `  Why Unique: ${gem.whyUnique}\n`;
    });
    output += `\n----------------------------------------------------------\n\n`;
  }

  // Heritage
  if (plan.heritage && plan.heritage.length > 0) {
    output += `🏛️ HERITAGE HIGHLIGHTS:\n`;
    plan.heritage.forEach(site => {
      output += `- ${site.name} (${site.location})\n`;
      output += `  "${site.description}"\n`;
      output += `  Cultural Significance: ${site.significance}\n`;
    });
    output += `\n----------------------------------------------------------\n\n`;
  }

  // Dining / Food
  if (plan.food && plan.food.length > 0) {
    output += `🍲 AUTHENTIC LOCAL CUISINE:\n`;
    plan.food.forEach(dish => {
      output += `- ${dish.name} (Stall/Restaurant: ${dish.restaurantName}) - Est. Price: ${formatCurrency(dish.priceEstimate)}\n`;
      output += `  "${dish.description}"\n`;
      output += `  Cultural Significance: ${dish.culturalSignificance}\n`;
      output += `  Vegetarian Option? ${dish.vegetarianOptions ? 'Yes ✅' : 'No'}\n`;
    });
    output += `\n----------------------------------------------------------\n\n`;
  }

  // Etiquette
  if (plan.culture) {
    output += `🌐 CULTURAL ETIQUETTE & CUSTOMS:\n`;
    output += `- Greetings: ${plan.culture.greetings}\n`;
    output += `- Customs: ${plan.culture.customs}\n`;
    output += `- Dress code: ${plan.culture.dress}\n`;
    output += `- Photography Rules: ${plan.culture.photographyRules}\n`;
    output += `- Tipping: ${plan.culture.tipping}\n`;
    output += `- Safety Guidelines: ${plan.culture.safety}\n\n`;
    if (plan.culture.dos && plan.culture.dos.length > 0) {
      output += `✅ DO'S:\n`;
      plan.culture.dos.forEach(item => output += `  - ${item}\n`);
    }
    if (plan.culture.donts && plan.culture.donts.length > 0) {
      output += `\n❌ DON'TS:\n`;
      plan.culture.donts.forEach(item => output += `  - ${item}\n`);
    }
    output += `\n----------------------------------------------------------\n\n`;
  }

  // Budget
  if (plan.budget) {
    output += `💰 FINANCIAL PLANNER SUMMARY:\n`;
    output += `- Estimated Total Cost: ${formatCurrency(plan.budget.estimatedTotalCost)}\n`;
    output += `- Transport Allocation: ${formatCurrency(plan.budget.transport)}\n`;
    output += `- Dining Allocation: ${formatCurrency(plan.budget.food)}\n`;
    output += `- Sightseeing Allocation: ${formatCurrency(plan.budget.tickets)}\n`;
    output += `- Shopping Allowance: ${formatCurrency(plan.budget.shopping)}\n`;
    output += `- Miscellaneous Buffer: ${formatCurrency(plan.budget.miscellaneous)}\n`;
    output += `- Remaining Balance: ${formatCurrency(plan.budget.remainingBudget)}\n`;
    output += `- Budget Feasible? ${plan.budget.isFeasible ? 'Yes ✅' : 'No ❌'}\n`;
    if (plan.budget.warnings && plan.budget.warnings.length > 0) {
      output += `\n⚠️ Budget Alerts:\n`;
      plan.budget.warnings.forEach(warn => output += `  - ${warn}\n`);
    }
    if (plan.budget.cheaperAlternatives && plan.budget.cheaperAlternatives.length > 0) {
      output += `\n💡 Ways to Save:\n`;
      plan.budget.cheaperAlternatives.forEach(alt => output += `  - ${alt}\n`);
    }
    output += `\n----------------------------------------------------------\n\n`;
  }

  // Language Phrases
  if (plan.localPhrases && plan.localPhrases.length > 0) {
    output += `🗣️ LOCAL PHRASEBOOK:\n`;
    plan.localPhrases.forEach(phr => {
      output += `- "${phr.phrase}" (Pronounce: ${phr.pronunciation}) - Meaning: "${phr.meaning}"\n`;
      output += `  Usage example: ${phr.usageExample}\n`;
    });
    output += `\n----------------------------------------------------------\n\n`;
  }

  // Travel Journal
  if (plan.travelJournal) {
    output += `📝 TRAVEL JOURNAL MEMORIES:\n`;
    output += `"${plan.travelJournal}"\n\n`;
  }

  // Instagram Caption
  if (plan.instagramCaption) {
    output += `📸 INSTAGRAM CAPTION:\n`;
    output += `"${plan.instagramCaption}"\n`;
  }

  return output;
};
