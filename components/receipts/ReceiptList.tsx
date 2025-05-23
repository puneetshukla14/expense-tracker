'use client';

interface Receipt {
  id: number;
  description: string;
  amount: number;
  date: string;
}

export default function ReceiptList({ receipts }: { receipts: Receipt[] }) {
  if (receipts.length === 0) return <p className="text-gray-500">No receipts added yet.</p>;

  return (
    <table className="w-full mt-4 border-collapse border">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">Description</th>
          <th className="border px-4 py-2">Amount (₹)</th>
          <th className="border px-4 py-2">Date</th>
        </tr>
      </thead>
      <tbody>
        {receipts.map((receipt) => (
          <tr key={receipt.id}>
            <td className="border px-4 py-2">{receipt.description}</td>
            <td className="border px-4 py-2">{receipt.amount.toFixed(2)}</td>
            <td className="border px-4 py-2">{receipt.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
