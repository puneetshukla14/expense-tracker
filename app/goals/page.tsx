'use client';

import GoalForm from '@/components/goals/GoalForm';
import GoalList from '@/components/goals/GoalList';

export default function GoalsPage() {
  return (
    <main className="main" style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '28px', marginBottom: '24px', color: 'var(--primary-color)' }}>
        Financial Goals
      </h2>
      <GoalForm />
      <GoalList />
    </main>
  );
}
