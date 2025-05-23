'use client';

import SpendingOverviewChart from '@/components/charts/SpendingOverviewChart';
import SpendingTrendChart from '@/components/charts/SpendingTrendChart';
import BudgetVsActualChart from '@/components/charts/BudgetVsActualChart';

export default function DashboardPage() {
  return (
    <main className="main p-8 min-h-screen bg-white dark:bg-[#121212]">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-200">
        Dashboard
      </h2>

      <div className="flex flex-col gap-8">
        <div className="w-full max-w-full bg-white dark:bg-transparent rounded-lg shadow-lg p-6">
          <BudgetVsActualChart />
        </div>

        <div className="w-full max-w-full bg-white dark:bg-transparent rounded-lg shadow-lg p-6">
          <SpendingOverviewChart />
        </div>

        <div className="w-full max-w-full bg-white dark:bg-transparent rounded-lg shadow-lg p-6">
          <SpendingTrendChart />
        </div>
      </div>
    </main>
  );
}
