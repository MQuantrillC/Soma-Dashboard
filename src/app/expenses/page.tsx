'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchSheetData, fetchExchangeRate, type SheetData } from '../../utils/fetchSheetsData';

export default function ExpensesPage() {
  const [data, setData] = useState<SheetData | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [expensesData, rate] = await Promise.all([
          fetchSheetData('Expenses Data'),
          fetchExchangeRate()
        ]);
        
        setData(expensesData);
        setExchangeRate(rate);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      const getCurrencyValue = (value: any, currency: 'USD' | 'PEN') => {
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
        totalUSD += getCurrencyValue(row[usdHeader], 'USD');
      }
      if (penHeader) {
        totalPEN += getCurrencyValue(row[penHeader], 'PEN');
      }
      if (totalPenHeader) {
        totalLocal += getCurrencyValue(row[totalPenHeader], 'PEN');
      }
    });
  
    return { 
      totalUSD: parseFloat(totalUSD.toFixed(2)), 
      totalPEN: parseFloat(totalPEN.toFixed(2)), 
      totalLocal: parseFloat(totalLocal.toFixed(2)) 
    };
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--soma-blanco)' }}>
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--soma-aquamarina)' }}></div>
            <span className="ml-4 body-text" style={{ color: 'var(--soma-petroleo)' }}>Loading expenses data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--soma-blanco)' }}>
        <div className="max-w-7xl mx-auto p-8">
          <div className="border rounded-xl p-6" style={{ backgroundColor: 'var(--soma-lavanda)', borderColor: 'var(--soma-petroleo)', opacity: 0.9 }}>
            <h2 className="heading-h2 mb-2" style={{ color: 'var(--soma-negro)' }}>Error Loading Data</h2>
            <p className="body-text mb-4" style={{ color: 'var(--soma-petroleo)' }}>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="button-text px-6 py-3 rounded-lg hover:opacity-80 transition-opacity"
              style={{ backgroundColor: 'var(--soma-pino)', color: 'white' }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--soma-blanco)' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="button-text hover:opacity-80 transition-opacity px-4 py-2 rounded-lg border-2" style={{ 
                color: '#015965', 
                borderColor: '#015965',
                backgroundColor: 'transparent'
              }}>
                ← Back to Dashboard
              </Link>
              <div className="h-6 w-px" style={{ backgroundColor: 'var(--soma-lavanda)' }}></div>
              <h1 className="heading-h1 font-bold" style={{ color: '#015965' }}>Expenses</h1>
            </div>
            {exchangeRate && (
              <div className="px-4 py-2 border-2 rounded" style={{ 
                borderColor: '#015965', 
                color: '#015965',
                backgroundColor: 'transparent'
              }}>
                <span className="button-text">
                  USD/PEN: {exchangeRate.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8">
        {/* Totals Section */}
        {data && data.rows.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total USD Expenses */}
            <div className="rounded-xl shadow-lg p-6 border-2" style={{ backgroundColor: '#2FFFCC', borderColor: '#015965' }}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#015965' }}>
                    <span className="button-text font-bold" style={{ color: '#2FFFCC' }}>$</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="small-text" style={{ color: '#015965' }}>Total USD Expenses</p>
                  <p className="text-3xl font-bold" style={{ color: '#015965' }}>
                    {formatCurrency(totals.totalUSD, 'USD')}
                  </p>
                </div>
              </div>
            </div>

            {/* Total PEN Expenses */}
            <div className="rounded-xl shadow-lg p-6 border-2" style={{ backgroundColor: '#2FFFCC', borderColor: '#015965' }}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#015965' }}>
                    <span className="button-text font-bold" style={{ color: '#2FFFCC' }}>S/</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="small-text" style={{ color: '#015965' }}>Total PEN Expenses</p>
                  <p className="text-3xl font-bold" style={{ color: '#015965' }}>
                    {formatCurrency(totals.totalPEN, 'PEN')}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Local Currency */}
            <div className="rounded-xl shadow-lg p-6 border-2" style={{ backgroundColor: '#2FFFCC', borderColor: '#015965' }}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#015965' }}>
                     <span className="button-text font-bold" style={{ color: '#2FFFCC' }}>S/</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="small-text" style={{ color: '#015965' }}>Total Local Currency</p>
                  <p className="text-3xl font-bold" style={{ color: '#015965' }}>
                    {formatCurrency(totals.totalLocal, 'PEN')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {data && data.rows.length > 0 ? (
          <div className="rounded-xl shadow-lg overflow-hidden border-2" style={{ 
            backgroundColor: 'var(--soma-blanco)', 
            borderColor: 'var(--soma-petroleo)' 
          }}>
            <div className="overflow-x-auto p-6">
              <table className="min-w-full">
                <thead style={{ backgroundColor: '#015965' }}>
                  <tr>
                    {data.headers.map((header, index) => (
                      <th 
                        key={index}
                        className="px-4 py-4 text-left small-text font-bold uppercase tracking-wider whitespace-nowrap border-b-2"
                        style={{ color: '#2FFFCC', borderColor: '#2FFFCC' }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {data.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-opacity-50 transition-all border-b" style={{ 
                      borderColor: 'var(--soma-aquamarina)'
                    }}>
                      {data.headers.map((header, colIndex) => (
                        <td 
                          key={colIndex}
                          className="px-4 py-4 body-text whitespace-nowrap"
                          style={{ color: '#015965' }}
                        >
                          {formatValue(row[header] ?? row[Object.keys(row)[colIndex]], header)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Expenses Data</h3>
            <p className="text-gray-600">No expense records were found in the Google Sheet.</p>
          </div>
        )}
      </div>
    </div>
  );
} 