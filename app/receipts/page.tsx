'use client';

import { useState } from 'react';
import ReceiptForm from '@/components/receipts/ReceiptForm';
import ReceiptList from '@/components/receipts/ReceiptList';

interface Receipt {
  id: number;
  description: string;
  amount: number;
  date: string;
}

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  const handleAddReceipt = (newReceipt: Receipt) => {
    setReceipts((prev) => [newReceipt, ...prev]);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Receipt Tracker</h1>
      <ReceiptForm onAdd={handleAddReceipt} />
      <ReceiptList receipts={receipts} />
    </div>
  );
}
