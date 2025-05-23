'use client';

const mockGoals = [
  { title: 'Buy Laptop', target: 70000, saved: 35000, targetDate: '2025-12-31' },
  { title: 'Goa Vacation', target: 50000, saved: 12000, targetDate: '2025-10-01' },
];

export default function GoalList() {
  return (
    <div className="card">
      <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Your Financial Goals</h3>
      {mockGoals.map((goal, idx) => {
        const percent = Math.round((goal.saved / goal.target) * 100);
        const barColor = percent < 50 ? 'orange' : 'green';

        return (
          <div key={idx} style={{ marginBottom: '1.5rem' }}>
            <strong>{goal.title}</strong>
            <p style={{ fontSize: '14px' }}>
              ₹{goal.saved} saved of ₹{goal.target} (Target: {goal.targetDate})
            </p>
            <div style={{
              height: '10px',
              background: '#eee',
              borderRadius: '5px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${Math.min(percent, 100)}%`,
                background: barColor,
                height: '100%',
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
