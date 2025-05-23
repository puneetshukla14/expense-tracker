'use client';
import React, { useState } from 'react';
import { Filter, RefreshCw } from 'lucide-react';

interface Filters {
  category: string;
  dateFrom: string;
  dateTo: string;
}

interface Props {
  onFilterChange: (filters: Filters) => void;
}

const FiltersPanel: React.FC<Props> = ({ onFilterChange }) => {
  const [category, setCategory] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [open, setOpen] = useState(true);

  const applyFilters = () => {
    onFilterChange({ category, dateFrom, dateTo });
  };

  const resetFilters = () => {
    setCategory('');
    setDateFrom('');
    setDateTo('');
    onFilterChange({ category: '', dateFrom: '', dateTo: '' });
  };

  return (
    <div className="w-full bg-white dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 rounded-2xl shadow-md overflow-hidden transition-all duration-300">
      
      {/* Header */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between px-6 py-4 cursor-pointer text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <span className="font-semibold text-lg">Filter Options</span>
        <span className="text-sm">{open ? 'Hide ▲' : 'Show ▼'}</span>
      </div>

      {/* Filter Content */}
      {open && (
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Category */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Category</label>
<select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
>
  <option value="">All Categories</option> {/* <-- yahan change kiya */}
  <option value="food">Food</option>
  <option value="transport">Transport</option>
  <option value="entertainment">Entertainment</option>
  <option value="other">Other</option>
</select>

            </div>

            {/* From Date */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 text-sm text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 text-sm text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 justify-end md:mt-6">
              <button
                onClick={applyFilters}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium"
              >
                <Filter size={16} />
                Apply
              </button>
              <button
                onClick={resetFilters}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl text-sm font-medium"
              >
                <RefreshCw size={16} />
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersPanel;
