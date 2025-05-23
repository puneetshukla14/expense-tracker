'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileSetupPage() {
  const router = useRouter();
  const [salary, setSalary] = useState('');
  const [emi, setEmi] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salary, emi }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      router.push('/dashboard');
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h1>Setup Your Profile</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="number"
          placeholder="Monthly Salary (Rs)"
          value={salary}
          onChange={e => setSalary(e.target.value)}
          required
          min="0"
        />
        <input
          type="number"
          placeholder="EMI / Extra Expenses (Rs)"
          value={emi}
          onChange={e => setEmi(e.target.value)}
          required
          min="0"
        />
        <button type="submit">Save Profile</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
