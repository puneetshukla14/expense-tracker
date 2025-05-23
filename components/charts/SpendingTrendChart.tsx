'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// Expense type with category, amount, and ISO date string
type Expense = {
  category: string;
  amount: number;
  date: string;
};

const FILTERS = ['daily', 'weekly', 'monthly'] as const;

export default function SpendingTrendChart() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filter, setFilter] = useState<typeof FILTERS[number]>('weekly');
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch expenses once on mount
  useEffect(() => {
    async function fetchExpenses() {
      setLoading(true);
      try {
        const response = await fetch('/api/expenses');
        const data = await response.json();

        // Parse and clean the fetched data
        const cleaned: Expense[] = data
          .filter((item: any) => !isNaN(parseFloat(item.amount)))
          .map((item: any) => ({
            category: item.category || 'Unknown',
            amount: parseFloat(item.amount),
            date: item.date,
          }));

        setExpenses(cleaned);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchExpenses();
  }, []);

  // Update chart data whenever expenses or filter changes
  useEffect(() => {
    if (!expenses.length) {
      setChartData(null);
      return;
    }

    const groupedData = groupExpensesByFilter(expenses, filter);

    const labels = Object.keys(groupedData).sort((a, b) => (a > b ? 1 : -1));
    const amounts = labels.map((label) => groupedData[label]);

    setChartData({
      labels,
      datasets: [
        {
          label: `${capitalize(filter)} Spending`,
          data: amounts,
          borderColor: '#0288D1',
          backgroundColor: 'rgba(3, 169, 244, 0.3)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    });
  }, [expenses, filter]);

  // Helper: group expenses by chosen filter period
  function groupExpensesByFilter(
    expenses: Expense[],
    filter: typeof FILTERS[number]
  ): Record<string, number> {
    return expenses.reduce((acc, { amount, date }) => {
      const d = dayjs(date);
      let key: string;

      switch (filter) {
        case 'daily':
          key = d.format('YYYY-MM-DD');
          break;
        case 'weekly':
          key = `${d.year()}-W${d.isoWeek().toString().padStart(2, '0')}`;
          break;
        case 'monthly':
          key = d.format('YYYY-MM');
          break;
        default:
          key = d.format('YYYY-MM-DD');
      }

      acc[key] = (acc[key] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);
  }

  // Capitalize first letter helper
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="w-full center-w-6xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-xl p-10 space-y-10 transition-transform hover:scale-[1.02] duration-300">

      {/* Filter Buttons */}
      <div className="flex gap-3 justify-center">
        {FILTERS.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            disabled={loading}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200
              ${
                filter === type
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {capitalize(type)}
          </button>
        ))}
      </div>

      {/* Chart or Loading / No data */}
      <div className="min-h-[280px] flex items-center justify-center">
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading chart...</p>
        ) : chartData ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: { color: '#CBD5E1' },
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                },
              },
              scales: {
                x: {
                  ticks: { color: '#94A3B8' },
                  grid: { color: '#334155' },
                },
                y: {
                  ticks: { color: '#94A3B8' },
                  grid: { color: '#334155' },
                  beginAtZero: true,
                },
              },
            }}
          />
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        )}
      </div>
    </div>
  );
}
