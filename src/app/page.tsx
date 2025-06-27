'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { fetchExchangeRate } from '../utils/fetchSheetsData';

export default function Home() {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExchangeRate()
      .then(setExchangeRate)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--soma-blanco)' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Image 
                src="/Assets/Soma_Written_Logo.png" 
                alt="Soma Dashboard" 
                width={128}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            
            {!loading && exchangeRate && (
              <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--soma-lavanda)', color: 'var(--soma-petroleo)' }}>
                <span className="button-text">
                  USD/PEN: {exchangeRate.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{ color: '#2FFFCC' }}>
            Business Dashboard
          </h1>
          <p className="body-text max-w-2xl mx-auto" style={{ color: 'var(--soma-petroleo)' }}>
            Monitor your company&apos;s financial data with real-time insights from Google Sheets
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Expenses Card */}
          <Link 
            href="/expenses" 
            className="group rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-opacity-30 hover:border-opacity-100"
            style={{ 
              backgroundColor: '#2FFFCC', 
              borderColor: 'var(--soma-petroleo)'
            }}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover:scale-110" style={{ backgroundColor: 'var(--soma-petroleo)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="var(--soma-aquamarina)" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-3" style={{ color: '#015965' }}>Expenses</h3>
              <p className="body-text mb-6" style={{ color: '#015965' }}>
                View and analyze all company expenses with detailed breakdowns by date, category, and payment method.
              </p>
              <div className="flex items-center button-text group-hover:translate-x-1 transition-transform" style={{ color: '#015965' }}>
                View Expenses
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Sales Data Card */}
          <Link 
            href="/sales" 
            className="group rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-opacity-30 hover:border-opacity-100"
            style={{ 
              backgroundColor: '#2FFFCC', 
              borderColor: 'var(--soma-petroleo)'
            }}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover:scale-110" style={{ backgroundColor: 'var(--soma-petroleo)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="var(--soma-aquamarina)" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10l4 12H5.4L7 7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-3" style={{ color: '#015965' }}>Sales Data</h3>
              <p className="body-text mb-6" style={{ color: '#015965' }}>
                Track sales performance, revenue trends, and customer insights with comprehensive data analysis.
              </p>
              <div className="flex items-center button-text group-hover:translate-x-1 transition-transform" style={{ color: '#015965' }}>
                View Sales Data
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
