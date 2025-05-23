'use client';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Expense {
  _id: string;
  title: string;
  amount: number;
  date: string;
  category?: string;
}

interface Filters {
  category: string;
  dateFrom: string;
  dateTo: string;
}

interface Props {
  filters: Filters;
}

const socket = io('http://localhost:4000');

export default function ExpenseTable({ filters }: Props) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/expenses');
      if (!res.ok) throw new Error('Failed to fetch expenses');
      const data = await res.json();
      setExpenses(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error fetching expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();

    socket.on('new-expense', (newExpense: Expense) => {
      setExpenses((prev) => [...prev, newExpense]);
    });

    return () => {
      socket.off('new-expense');
    };
  }, []);

  const handleCellChange = (rowIndex: number, key: keyof Expense, value: string) => {
    const updated = [...expenses];
    if (key === 'amount') {
      updated[rowIndex][key] = parseFloat(value) || 0;
    } else {
      updated[rowIndex][key] = value;
    }
    setExpenses(updated);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete expense');
      setExpenses((prev) => prev.filter((expense) => expense._id !== id));
    } catch (err: any) {
      alert(err.message || 'Error deleting expense');
    }
  };

  const handleEditToggle = (id: string) => {
    setEditingRow((prev) => (prev === id ? null : id));
  };

  const addEntry = () => {
    const newExpense: Expense = {
      _id: Date.now().toString(),
      title: '',
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      category: '',
    };
    setExpenses((prev) => [...prev, newExpense]);
    setEditingRow(newExpense._id);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory =
      !filters.category || expense.category?.toLowerCase().includes(filters.category.toLowerCase());
    const matchesDateFrom = !filters.dateFrom || new Date(expense.date) >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || new Date(expense.date) <= new Date(filters.dateTo);
    return matchesCategory && matchesDateFrom && matchesDateTo;
  });

  if (loading) return <p className="text-center py-8 text-gray-400">Loading expenses...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

  const columns = ['title', 'amount', 'date', 'category'];

  return (
    <div className="p-6 backdrop-blur-lg bg-white/80 dark:bg-white/5 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">💰 Expense Tracker</h2>
        <button
          onClick={addEntry}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full font-medium shadow-md transition-all"
        >
          <Plus size={16} /> Add Entry
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 uppercase border-b border-gray-300 dark:border-gray-600">
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 text-left tracking-wide font-semibold">
                  {col}
                </th>
              ))}
              <th className="px-4 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense, rowIndex) => (
              <tr
                key={expense._id}
                className="transition hover:bg-gray-100 dark:hover:bg-white/10 border-b border-gray-200 dark:border-gray-700"
              >
                {columns.map((col) => (
                  <td key={col} className="px-4 py-3">
                    <input
                      type={col === 'amount' ? 'number' : col === 'date' ? 'date' : 'text'}
                      value={
                        col === 'date'
                          ? expense.date?.slice(0, 10)
                          : (expense as any)[col]
                      }
                      onChange={(e) =>
                        handleCellChange(rowIndex, col as keyof Expense, e.target.value)
                      }
                      readOnly={editingRow !== expense._id}
                      className={`w-full px-2 py-1 bg-transparent text-sm rounded-md outline-none transition ${
                        editingRow === expense._id
                          ? 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-black/30 text-black dark:text-white'
                          : 'text-gray-500 dark:text-gray-400 cursor-default'
                      }`}
                    />
                  </td>
                ))}
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center items-center gap-3">
                    <button
                      onClick={() => handleEditToggle(expense._id)}
                      className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium shadow transition ${
                        editingRow === expense._id
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-yellow-400 hover:bg-yellow-500 text-gray-800'
                      }`}
                    >
                      <Pencil size={14} className="mr-1" />
                      {editingRow === expense._id ? 'Done' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="flex items-center px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-full shadow transition"
                    >
                      <Trash2 size={14} className="mr-1" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredExpenses.length === 0 && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            🚫 No expenses match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
