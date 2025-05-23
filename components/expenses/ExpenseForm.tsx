'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExpenseForm: React.FC = () => {
  // Initialize date to today's date in yyyy-mm-dd format
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: today,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMsg) {
      const timeout = setTimeout(() => setSuccessMsg(''), 3000);
      return () => clearTimeout(timeout);
    }
  }, [successMsg]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        setFormData({ title: '', amount: '', category: '', date: today });
        setSuccessMsg('Expense added successfully!');
      } else {
        console.error('Failed to add expense');
        setSuccessMsg('Failed to add expense. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setSuccessMsg('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 rounded-3xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-2xl hover:scale-[1.02]">
      {/* Form header */}
      <div className="px-8 py-5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white font-semibold text-xl rounded-t-3xl select-none">
        Add Expense
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="p-8 space-y-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-4 text-base text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Amount
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-4 text-base text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-4 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500 transition"
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="entertainment">Entertainment</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-4 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-3xl text-white font-semibold text-lg transition-transform hover:scale-105"
          >
            {loading ? 'Adding...' : 'Add Expense'}
          </button>

          <AnimatePresence>
            {successMsg && (
              <motion.p
                key="successMsg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-green-500 font-semibold text-lg select-none"
              >
                {successMsg}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.form>
    </div>
  );
};

export default ExpenseForm;
