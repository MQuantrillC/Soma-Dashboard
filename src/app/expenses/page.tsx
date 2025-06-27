'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchSheetData, type SheetData, type SheetRow } from '../../utils/fetchSheetsData';

export default function ExpensesPage() {
  const [data, setData] = useState<SheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [expensesData] = await Promise.all([
          fetchSheetData('Expenses Data'),
        ]);
        
        setData(expensesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const formatCurrency = (value: string | number | null, currency: 'USD' | 'PEN') => {
    if (value === null || value === '' || value === undefined) return '-';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return value || '-'; // Return original value if not a number
    
    const symbol = currency === 'USD' ? '$' : 'S/';
    return `${symbol}${numValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateValue: string | number | null) => {
    if (!dateValue) return '-';
    
    // Handle Google Sheets Date format like "Date(2025,0,4)"
    if (typeof dateValue === 'string' && dateValue.startsWith('Date(')) {
      const match = dateValue.match(/Date\((\d+),(\d+),(\d+)\)/);
      if (match) {
        const year = parseInt(match[1]);
        const month = parseInt(match[2]); // Google Sheets uses 0-based months
        const day = parseInt(match[3]);
        const date = new Date(year, month, day);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
    }
    
    // Handle regular date formats
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return dateValue; // Return original if can't parse
    
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatValue = (value: string | number | null, header: string) => {
    if (value === null || value === '' || value === undefined) return '-';
    
    // Format currency columns
    if (header.toLowerCase().includes('usd') || header.toLowerCase().includes('dollar')) {
      return formatCurrency(value, 'USD');
    }
    if (header.toLowerCase().includes('sol') || header.toLowerCase().includes('pen') || header.toLowerCase().includes('s/')) {
      return formatCurrency(value, 'PEN');
    }
    
    // Format date columns
    if (header.toLowerCase().includes('fecha') || header.toLowerCase().includes('date')) {
      return formatDate(value);
    }
    
    // Default formatting
    return value.toString();
  };

  // Calculate totals
  const calculateTotals = () => {
    if (!data || !data.rows.length) {
      return { totalUSD: 0, totalPEN: 0, totalLocal: 0 };
    }
  
    let totalUSD = 0;
    let totalPEN = 0;
    let totalLocal = 0;
  
    // Case-insensitive header matching with trim
    const usdHeader = data.headers.find(h => 
      h.trim().toUpperCase() === 'USD' || 
      h.trim().toUpperCase().includes('DOLLAR')
    );
    const penHeader = data.headers.find(h => 
      h.trim().toUpperCase() === 'PEN' || 
      h.trim().toUpperCase().includes('SOL')
    );
    const totalPenHeader = data.headers.find(h => 
      h.trim().toUpperCase() === 'TOTAL PEN'
    );
  
    data.rows.forEach(row => {
      // Helper function to extract numeric value from currency strings
      const getCurrencyValue = (value: SheetRow[string]) => {
        if (value === null || value === undefined) return 0;
        
        const str = value.toString().trim();
        
        // Remove currency symbols and thousands separators
        let cleaned = str.replace(/[^\d.-]/g, '');
        
        // Handle cases where negative numbers might be formatted as (123.45)
        if (str.includes('(') && str.includes(')')) {
          cleaned = '-' + cleaned;
        }
        
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
      };
  
      if (usdHeader) {
        totalUSD += getCurrencyValue(row[usdHeader]);
      }
      if (penHeader) {
        totalPEN += getCurrencyValue(row[penHeader]);
      }
      if (totalPenHeader) {
        totalLocal += getCurrencyValue(row[totalPenHeader]);
      }
    });
  
    return { 
      totalUSD: parseFloat(totalUSD.toFixed(2)), 
      totalPEN: parseFloat(totalPEN.toFixed(2)), 
      totalLocal: parseFloat(totalLocal.toFixed(2)) 
    };
  };

  const totals = calculateTotals();

  // Calculate monthly summaries
  const calculateMonthlySummary = () => {
    if (!data || !data.rows.length) {
      return {};
    }

    const dateHeader = data.headers.find(h => h.trim().toLowerCase().includes('fecha') || h.trim().toLowerCase().includes('date'));
    const usdHeader = data.headers.find(h => h.trim().toUpperCase() === 'USD' || h.trim().toUpperCase().includes('DOLLAR'));
    const penHeader = data.headers.find(h => h.trim().toUpperCase() === 'PEN' || h.trim().toUpperCase().includes('SOL'));
    const totalPenHeader = data.headers.find(h => h.trim().toUpperCase() === 'TOTAL PEN');

    if (!dateHeader || (!usdHeader && !penHeader && !totalPenHeader)) {
      return {};
    }

    const monthlySummary: { [month: string]: { usd: number, pen: number, local: number } } = {};

    data.rows.forEach(row => {
      const dateValue = row[dateHeader];
      if (!dateValue) return;

      let date;
      if (typeof dateValue === 'string' && dateValue.startsWith('Date(')) {
        const match = dateValue.match(/Date\((\d+),(\d+),(\d+)\)/);
        if (match) {
          date = new Date(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
        } else {
          return;
        }
      } else {
        date = new Date(dateValue);
      }

      if (isNaN(date.getTime())) return;

      const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });

      if (!monthlySummary[monthYear]) {
        monthlySummary[monthYear] = { usd: 0, pen: 0, local: 0 };
      }

      const getNumericValue = (value: SheetRow[string]) => {
        if (value === null || value === undefined) return 0;
        const num = parseFloat(value.toString().replace(/[^\d.-]/g, ''));
        return isNaN(num) ? 0 : num;
      };
      
      if (usdHeader) monthlySummary[monthYear].usd += getNumericValue(row[usdHeader]);
      if (penHeader) monthlySummary[monthYear].pen += getNumericValue(row[penHeader]);
      if (totalPenHeader) monthlySummary[monthYear].local += getNumericValue(row[totalPenHeader]);
    });

    return monthlySummary;
  };

  const monthlySummary = calculateMonthlySummary();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
        <div className="max-w-7xl mx-auto p-8 text-center">
          <p className="text-red-500 text-lg">Error: {error}</p>
          <p className="text-gray-400 mt-2">Could not fetch expenses data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/Assets/Soma_Logo.png" alt="Soma Logo" width={50} height={50} />
            <h1 className="ml-4 text-3xl font-bold">Expenses Data</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/" className="px-4 py-2 rounded-lg border border-gray-600 text-lg font-medium text-gray-300 hover:bg-gray-700 hover:border-gray-500 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/sales" className="px-4 py-2 rounded-lg border border-gray-600 text-lg font-medium text-gray-300 hover:bg-gray-700 hover:border-gray-500 hover:text-white transition-colors">
              Sales
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Totals Section */}
        {data && data.rows.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Total Expenses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-300">Total (USD)</h3>
                  <div className="relative group ml-2">
                    <span className="text-xs text-gray-500 border border-gray-500 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer">?</span>
                    <div className="absolute bottom-full mb-2 w-max max-w-xs px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Total expenses paid in USD
                    </div>
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mt-2">${totals.totalUSD.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-300">Total (PEN)</h3>
                  <div className="relative group ml-2">
                    <span className="text-xs text-gray-500 border border-gray-500 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer">?</span>
                    <div className="absolute bottom-full mb-2 w-max max-w-xs px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Total expenses paid in PEN
                    </div>
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mt-2">S/{totals.totalPEN.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-300">Total (Local PEN)</h3>
                   <div className="relative group ml-2">
                    <span className="text-xs text-gray-500 border border-gray-500 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer">?</span>
                    <div className="absolute bottom-full mb-2 w-max max-w-xs px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Total expenses paid in USD + Total expenses paid in PEN converted to the local currency (PEN)
                    </div>
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mt-2">S/{totals.totalLocal.toLocaleString()}</p>
              </div>
            </div>
          </section>
        )}

        {/* Monthly Summary */}
        {Object.keys(monthlySummary).length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Monthly Summary</h2>
            <div className="overflow-x-auto bg-gray-800 rounded-lg">
              <table className="min-w-full text-left text-sm text-gray-300">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="p-4">Month</th>
                    <th scope="col" className="p-4 text-right">USD Paid</th>
                    <th scope="col" className="p-4 text-right">PEN Paid</th>
                    <th scope="col" className="p-4 text-right">Total Local Currency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {Object.entries(monthlySummary).map(([month, summary]) => (
                    <tr key={month}>
                      <td className="p-4 font-semibold">{month}</td>
                      <td className="p-4 text-right">{formatCurrency(summary.usd, 'USD')}</td>
                      <td className="p-4 text-right">{formatCurrency(summary.pen, 'PEN')}</td>
                      <td className="p-4 text-right">{formatCurrency(summary.local, 'PEN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Raw Data Table */}
        {data && data.rows.length > 0 ? (
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">Raw Expenses Data</h2>
            <div className="overflow-x-auto bg-gray-800 rounded-lg">
              <table className="min-w-full text-left text-sm text-gray-300">
                <thead className="bg-gray-700">
                  <tr>
                    {data.headers.map((header, index) => (
                      <th key={index} scope="col" className="p-4 whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {data.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {data.headers.map((header, colIndex) => (
                        <td key={colIndex} className="p-4 whitespace-nowrap">
                          {formatValue(row[header], header)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No expenses data to display.</p>
          </div>
        )}
      </main>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-cyan-500 text-white shadow-lg hover:bg-cyan-600 transition-colors"
          aria-label="Back to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
} 