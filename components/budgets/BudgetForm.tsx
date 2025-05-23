'use client';

import { useState } from 'react';

export default function BudgetForm() {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/budgets', {
      method: 'POST',
      body: JSON.stringify({
        category,
        amount: parseFloat(amount),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('✅ Budget saved');
      setCategory('');
      setAmount('');
    } else {
      setMessage(data.message || '❌ Failed to save');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        style={{ marginRight: 12, padding: '8px' }}
      />
      <input
        type="number"
        placeholder="Amount (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        style={{ marginRight: 12, padding: '8px' }}
      />
      <button type="submit" style={{ padding: '8px 16px' }}>Save</button>
      {message && <p style={{ marginTop: '8px' }}>{message}</p>}
    </form>
  );
}
