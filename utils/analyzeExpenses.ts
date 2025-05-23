import dayjs from 'dayjs';

export type Expense = {
  category: string;
  amount: number;
  date: string;
};
export type Alert = {
  category: string;
  changePercent: number;
};
export function analyzeExpenses(expenses: Expense[]) {
  const grouped: Record<string, Record<string, number>> = {};

  expenses.forEach(({ category, amount, date }) => {
    const month = dayjs(date).format('YYYY-MM');
    if (!grouped[month]) grouped[month] = {};
    grouped[month][category] = (grouped[month][category] || 0) + amount;
  });

  const thisMonth = dayjs().format('YYYY-MM');
  const lastMonth = dayjs().subtract(1, 'month').format('YYYY-MM');

  const thisData = grouped[thisMonth] || {};
  const lastData = grouped[lastMonth] || {};

  const alerts: Alert[] = [];

  Object.keys(thisData).forEach((cat) => {
    const thisAmt = thisData[cat];
    const lastAmt = lastData[cat] || 0;

    if (lastAmt === 0 && thisAmt > 0) {
      alerts.push({ category: cat, changePercent: 100 });
    } else if (lastAmt > 0) {
      const change = ((thisAmt - lastAmt) / lastAmt) * 100;
      if (change >= 20) {
        alerts.push({ category: cat, changePercent: change });
      }
    }
  });

  return { summary: thisData, alerts };
}
