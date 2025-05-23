'use client';
import { useState } from 'react';

export default function GoalForm() {
  const [form, setForm] = useState({
    title: '',
    targetAmount: '',
    targetDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form className="card" style={{ marginBottom: '2rem' }}>
      <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Create Financial Goal</h3>
      <div className="form-row">
        <input
          type="text"
          name="title"
          placeholder="Goal Title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          type="number"
          name="targetAmount"
          placeholder="Target Amount"
          value={form.targetAmount}
          onChange={handleChange}
        />
        <input
          type="date"
          name="targetDate"
          value={form.targetDate}
          onChange={handleChange}
        />
        <button type="button">Add Goal</button>
      </div>
    </form>
  );
}
