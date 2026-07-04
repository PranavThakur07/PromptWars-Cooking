export const validateForm = (formData) => {
  const errors = {};

  const peopleNum = Number(formData.people);
  if (!formData.people || peopleNum <= 0) {
    errors.people = 'Number of people must be at least 1';
  } else if (!Number.isInteger(peopleNum)) {
    errors.people = 'Number of people must be an integer';
  }

  const budgetNum = Number(formData.budget);
  if (!formData.budget || budgetNum <= 0) {
    errors.budget = 'Budget must be greater than 0';
  } else if (isNaN(budgetNum)) {
    errors.budget = 'Budget must be a valid number';
  }

  if (!formData.dietaryPreference) {
    errors.dietaryPreference = 'Dietary preference is required';
  }

  if (!formData.cookingTime) {
    errors.cookingTime = 'Available cooking time is required';
  }

  if (!formData.goal) {
    errors.goal = 'Cooking goal is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Basic sanitization to strip HTML tags and characters that could break parsing or prompts.
 */
export const sanitizeInput = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/[\`"\\{}]/g, '') // remove backticks, double quotes, slashes, braces
    .trim();
};
