'use client';

import { useEffect, useState } from 'react';

interface Budget {
  _id: string;
  category: string;
  amount: number;
  createdAt: string;
}

export default function BudgetList() {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    fetch('/api/budgets')
      .then((res) => res.json())
      .then((data) => setBudgets(data))
      .catch((err) => console.error('Failed to load budgets:', err));
  }, []);

  return (
    <div>
      <h3 style={{ marginBottom: '12px' }}>Your Budgets</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Category</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Amount (₹)</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Created</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((b) => (
            <tr key={b._id}>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{b.category}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{b.amount}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {new Date(b.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
