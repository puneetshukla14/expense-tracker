'use client';

import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#6c5ce7', '#00cec9', '#fdcb6e', '#e17055', '#55efc4'];
const SALARY = 50000;

type Expense = {
  category: string;
  amount: number;
};

export default function SpendingDashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalSpent, setTotalSpent] = useState<number>(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      const res = await fetch('/api/expenses');
      const data = await res.json();

      const parsed = data
        .filter((exp: any) => !isNaN(parseFloat(exp.amount)))
        .map((exp: any) => ({
          category: exp.category,
          amount: parseFloat(exp.amount),
        })) as Expense[];

      setExpenses(parsed);
      const total = parsed.reduce((sum, exp) => sum + exp.amount, 0);
      setTotalSpent(total);
    };

    fetchExpenses();
  }, []);

  const remaining = Math.max(SALARY - totalSpent, 0);

  const pieData = expenses.reduce<Record<string, number>>((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const formattedPieData = Object.entries(pieData).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  const barData = [
    { name: 'Income', value: SALARY },
    { name: 'Spent', value: totalSpent },
    { name: 'Remaining', value: remaining },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Pie Chart Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800"
        >
          <header className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Spending by Category</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">See how your money is distributed</p>
          </header>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {formattedPieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar Chart Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800"
        >
          <header className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Budget Overview</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Compare income, spending, and what's left</p>
          </header>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#6c5ce7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
