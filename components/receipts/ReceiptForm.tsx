'use client';

import { useState } from 'react';

export default function ReceiptForm({ onAdd }: { onAdd: (receipt: any) => void }) {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ description: '', amount: '', date: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://127.0.0.1:5000/ocr', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to parse image');

      setForm({
        description: data.description || '',
        amount: data.amount || '',
        date: data.date || '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...form, amount: parseFloat(form.amount), id: Date.now() });
    setForm({ description: '', amount: '', date: '' });
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow">
      <div>
        <label className="block font-medium">Upload Receipt Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
        {loading && <p className="text-blue-500">Processing image...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>

      <input
        name="description"
        type="text"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        required
        className="w-full p-2 border rounded"
      />

      <input
        name="amount"
        type="number"
        step="0.01"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount (₹)"
        required
        className="w-full p-2 border rounded"
      />

      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
        Add Receipt
      </button>
    </form>
  );
}
