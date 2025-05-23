'use client';

import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  Plugin,
  ChartData,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const SALARY = 50000;

type Expense = {
  category: string;
  amount: number;
};

// Animated number count hook
function useAnimatedNumber(target: number, duration = 1000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const current = Math.min(
        Math.floor((progress / duration) * target),
        target
      );
      setValue(current);
      if (progress < duration) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return value;
}

export default function BudgetVsActualChart() {
  const [spent, setSpent] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch('/api/expenses');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data: Expense[] = await res.json();

        const totalSpent = data.reduce((acc, curr) => acc + curr.amount, 0);
        setSpent(totalSpent);
      } catch (err) {
        console.error('Failed to fetch expenses:', err);
        setError('Failed to load expenses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const remaining = SALARY - spent;
  const spentPercent = Math.min((spent / SALARY) * 100, 100);
  const isOverBudget = spent > SALARY;

  // Animate numbers for smooth effect
  const animatedSpent = useAnimatedNumber(spent);
  const animatedRemaining = useAnimatedNumber(Math.max(remaining, 0));

  // Gradient plugin for doughnut 'Spent' slice
const gradientPlugin: Plugin<'doughnut'> = {
  id: 'gradientPlugin',
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    if (!chartArea) return;

    const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
    gradient.addColorStop(0, '#0f4c5c'); // dark teal
    gradient.addColorStop(1, '#00bcd4'); // bright cyan

    if (chart.data.datasets[0].backgroundColor) {
      (chart.data.datasets[0].backgroundColor as any)[0] = gradient;
    }

    // Draw center text (percentage)
    const centerText = isOverBudget
      ? 'Over Budget!'
      : `${spentPercent.toFixed(1)}% Spent`;

    const fontSizeBase = (chartArea.right - chartArea.left) / 8;
    const fontSize = Math.min(fontSizeBase, 22); // max font size 40px

    ctx.save();
    ctx.fillStyle = isOverBudget ? '#dc2626' : '#0f172a';
    ctx.font = `bold ${fontSize}px 'Inter', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      centerText,
      (chartArea.left + chartArea.right) / 2,
      (chartArea.top + chartArea.bottom) / 2
    );
    ctx.restore();
  },
};


  const data: ChartData<'doughnut'> = {
    labels: ['Spent', 'Remaining'],
    datasets: [
      {
        data: [spent, remaining > 0 ? remaining : 0],
        backgroundColor: [
          '#0f4c5c', // overridden by gradientPlugin
          '#d1e8e2', // very light teal/gray for remaining
        ],
        borderColor: ['transparent', '#94a3b8'],
        borderWidth: 1.5,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: '65%',
    animation: {
      animateRotate: true,
      duration: 800,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 20,
          padding: 24,
          font: {
            size: 15,
            weight: 600,
            family: "'Inter', sans-serif",
          },
          color: '#0f172a',
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#d1e8e2',
        bodyColor: '#94a3b8',
        padding: 12,
        cornerRadius: 6,
        displayColors: false,
        boxPadding: 0,
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw as number;
            const percent = ((value / SALARY) * 100).toFixed(1);
            return `${label}: ₹${value.toLocaleString()} (${percent}%)`;
          },
        },
      },
    },
  };

  return (
    <div
      className="w-full max-w-8xl mx-auto bg-white rounded-2xl shadow-xl p-10 md:p-16 flex flex-col md:flex-row items-center md:items-center gap-12"
      role="region"
      aria-label="Budget versus Actual Expenses"
    >
      {/* Left: Doughnut Chart */}
      <div
        className="w-full max-w-xs md:max-w-none md:w-72 flex-shrink-0 flex justify-center"
        aria-live="polite"
        aria-busy={loading}
      >
        {loading ? (
          <p className="text-center text-gray-400 italic">Loading expenses...</p>
        ) : error ? (
          <p className="text-center text-red-700 font-semibold" role="alert">
            {error}
          </p>
        ) : (
          <Doughnut data={data} options={options} plugins={[gradientPlugin]} />
        )}
      </div>

      {/* Right: Content */}
      <div className="flex-1 max-w-lg">
        <h3 className="text-3xl font-semibold text-[#0f172a] mb-8 text-center md:text-left">
          Budget vs Actual
        </h3>

        {!loading && !error && (
          <>
            <div className="text-[#475569] text-center md:text-left mb-6 text-lg tracking-wide">
              Total Budget:{' '}
              <span className="font-semibold text-[#0f172a]">
                ₹{SALARY.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between mb-3 px-1 text-sm font-medium text-[#0f172a]">
              <span>Spent: ₹{animatedSpent.toLocaleString()}</span>
              <span>Remaining: ₹{animatedRemaining.toLocaleString()}</span>
            </div>

            <div className="w-full bg-[#d1e8e2] rounded-full h-6 overflow-hidden shadow-inner">
              <div
                className={`h-6 transition-all duration-700 ease-in-out ${
                  isOverBudget
                    ? 'bg-red-700'
                    : 'bg-gradient-to-r from-cyan-500 to-teal-500'
                }`}
                style={{ width: `${spentPercent}%` }}
                aria-valuenow={spentPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
              ></div>
            </div>

            <p
              className={`mt-4 font-semibold text-center md:text-left ${
                isOverBudget ? 'text-red-700' : 'text-cyan-600'
              } text-lg tracking-wide`}
              aria-live="polite"
            >
              {isOverBudget
                ? `Over budget by ₹${(spent - SALARY).toLocaleString()}`
                : `Under budget by ₹${(SALARY - spent).toLocaleString()}`}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
