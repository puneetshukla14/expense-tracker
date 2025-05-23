'use client';
import React, { useState } from 'react';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import ExpenseTable from '@/components/expenses/ExpenseTable';
import FiltersPanel from '@/components/expenses/FiltersPanel';

interface Filters {
  category: string;
  dateFrom: string;
  dateTo: string;
}

const ExpensesPage = () => {
  const [filters, setFilters] = useState<Filters>({
    category: '',
    dateFrom: '',
    dateTo: '',
  });

  return (
    <main className="min-h-screen p-8 bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-8">Expenses</h1>

      <section className="filters-section mb-6">
        <FiltersPanel onFilterChange={setFilters} />
      </section>

      <section className="form-section mb-6 bg-white dark:bg-transparent rounded-lg shadow-lg p-6">
        <ExpenseForm />
      </section>

      <section className="table-section bg-white dark:bg-transparent rounded-lg shadow-lg p-6">
        <ExpenseTable filters={filters} />
      </section>
    </main>
  );
};

export default ExpensesPage;
