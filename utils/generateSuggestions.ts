// utils/generateSuggestions.ts

import { Expense } from './analyzeExpenses.js';

export function generateSuggestions(expenses: Expense[]): string[] {
  const tips: string[] = [];

  const foodSpending = expenses
    .filter(e => e.category === 'food')
    .reduce((sum, e) => sum + e.amount, 0);

  const travelSpending = expenses
    .filter(e => e.category === 'travel')
    .reduce((sum, e) => sum + e.amount, 0);

  if (foodSpending > 5000) {
    tips.push('Try cooking more at home to reduce food spending.');
  }

  if (travelSpending > 3000) {
    tips.push('Consider using public transport or carpooling to cut travel costs.');
  }

  if (tips.length === 0) {
    tips.push('Great job! Your spending looks balanced.');
  }

  return tips;
}
