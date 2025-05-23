'use client';

import BudgetForm from '@/components/budgets/BudgetForm';
import BudgetList from '@/components/budgets/BudgetList';

export default function BudgetsPage() {
  return (
    <main className="main" style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '28px', marginBottom: '24px', color: 'var(--primary-color)' }}>
        Budgets
      </h2>
      <BudgetForm />
      <BudgetList />
    </main>
  );
}
