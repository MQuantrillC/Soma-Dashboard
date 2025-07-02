'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchSheetData } from '../utils/fetchSheetsData';

export default function HomePage() {
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch sales and expenses data in parallel
        const [salesData, expensesData] = await Promise.all([
          fetchSheetData('Sales Data'),
          fetchSheetData('Expenses Data')
        ]);

        // Calculate Total Income from sales
        let income = 0;
        const unitPriceCol = salesData.headers.find(h => h.toLowerCase().includes('unit') && h.toLowerCase().includes('price'));
        const quantityCol = salesData.headers.find(h => h.toLowerCase().includes('order') && h.toLowerCase().includes('quantity'));
        if (unitPriceCol && quantityCol) {
          salesData.rows.forEach(row => {
            const unitPrice = parseFloat(row[unitPriceCol]?.toString() || '0') || 0;
            const quantity = parseFloat(row[quantityCol]?.toString() || '0') || 0;
            income += unitPrice * quantity;
          });
        }
        setTotalIncome(income);

        // Calculate Total Expenses from expenses
        let expenses = 0;
        const totalPenHeader = expensesData.headers.find(h => h.trim().toUpperCase() === 'TOTAL PEN');
        if (totalPenHeader) {
          expensesData.rows.forEach(row => {
            const expenseValue = row[totalPenHeader];
            if (expenseValue !== null && expenseValue !== undefined) {
              const cleaned = expenseValue.toString().replace(/[^\d.-]/g, '');
              const num = parseFloat(cleaned);
              if (!isNaN(num)) {
                expenses += num;
              }
            }
          });
        }
        setTotalExpenses(expenses);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const balance = totalIncome - totalExpenses;

  const formatCurrency = (value: number) => {
    return `S/${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Image src="/Assets/Soma_Logo.png" alt="Loading..." width={80} height={80} className="animate-spin-logo" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="py-5 px-5 sm:px-6 lg:px-8 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/Assets/Soma_Logo.png" alt="Soma Logo" width={40} height={40} className="sm:w-[50px] sm:h-[50px]" />
            <h1 className="ml-3 text-2xl sm:text-3xl font-bold">Soma Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-5 sm:p-6 lg:p-8">
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Financial Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-gray-300">Total Income</h3>
              <p className="text-2xl sm:text-3xl font-bold text-green-400 mt-2">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-gray-300">Total Expenses</h3>
              <p className="text-2xl sm:text-3xl font-bold text-red-400 mt-2">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-gray-300">Balance</h3>
              <p className={`text-2xl sm:text-3xl font-bold mt-2 ${balance >= 0 ? 'text-blue-400' : 'text-yellow-400'}`}>
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Navigate</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Link href="/sales" className="block p-4 sm:p-6 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-gray-500 transition-colors">
              <h3 className="text-lg sm:text-xl font-bold">Sales Data</h3>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">View detailed sales records and analytics.</p>
            </Link>
            <Link href="/expenses" className="block p-4 sm:p-6 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-gray-500 transition-colors">
              <h3 className="text-lg sm:text-xl font-bold">Expenses Data</h3>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">View detailed expense records and summaries.</p>
            </Link>
            <Link href="/projections" className="block p-4 sm:p-6 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-gray-500 transition-colors">
              <h3 className="text-lg sm:text-xl font-bold">Projections</h3>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">Forecast future sales and profitability.</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
