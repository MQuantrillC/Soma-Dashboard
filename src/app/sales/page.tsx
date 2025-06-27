'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchSheetData, fetchExchangeRate, type SheetData } from '../../utils/fetchSheetsData';

export default function SalesPage() {
  const [data, setData] = useState<SheetData | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [salesData, rate] = await Promise.all([
          fetchSheetData('Sales Data'),
          fetchExchangeRate()
        ]);
        
        setData(salesData);
        setExchangeRate(rate);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch sales data');
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

  // Add scroll synchronization
  useEffect(() => {
    const tableContainer = document.getElementById('sales-table-container');
    const scrollIndicator = document.getElementById('scroll-indicator');
    
    if (tableContainer && scrollIndicator) {
      const handleScroll = () => {
        const scrollLeft = tableContainer.scrollLeft;
        const scrollWidth = tableContainer.scrollWidth - tableContainer.clientWidth;
        const scrollPercentage = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
        scrollIndicator.style.left = `${scrollPercentage}%`;
      };

      tableContainer.addEventListener('scroll', handleScroll);
      return () => tableContainer.removeEventListener('scroll', handleScroll);
    }
  }, [data]);

  const formatCurrency = (value: string | number | null, currency: 'USD' | 'PEN') => {
    if (value === null || value === '' || value === undefined) return '-';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return value || '-'; // Return original value if not a number
    
    const symbol = currency === 'USD' ? '$' : 'S/';
    return `${symbol}${numValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateValue: string | number | null) => {
    if (!dateValue) return '-';

    // Handle Google Sheets Date format like "Date(2025,4,31,17,52,59)"
    if (typeof dateValue === 'string' && dateValue.startsWith('Date(')) {
      const parts = dateValue.substring(5, dateValue.length - 1).split(',');
      if (parts.length >= 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]); // Google Sheets month is 0-based
        const day = parseInt(parts[2]);
        const hour = parts.length > 3 ? parseInt(parts[3]) : 0;
        const minute = parts.length > 4 ? parseInt(parts[4]) : 0;
        const second = parts.length > 5 ? parseInt(parts[5]) : 0;
        
        const date = new Date(Date.UTC(year, month, day, hour, minute, second));

        if (isNaN(date.getTime())) {
          return dateValue.toString();
        }

        // Format to 'Mon DD, YYYY, hh:mm A'
        return date.toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'UTC'
        });
      }
    }

    // Handle regular date formats
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return dateValue.toString();
      }
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateValue.toString();
    }
  };

  const formatValue = (value: string | number | null, header: string) => {
    if (value === null || value === '' || value === undefined) return '-';
    
    // Filter out "Data Last updated" text
    const stringValue = value.toString();
    if (stringValue.toLowerCase().includes('data last updated')) {
      return '-';
    }
    
    // Attempt to format as a date if it matches the specific Google Sheets format
    if (typeof value === 'string' && value.startsWith('Date(')) {
      return formatDate(value);
    }
    
    // Format currency columns
    if (header.toLowerCase().includes('usd') || header.toLowerCase().includes('dollar') || header.toLowerCase().includes('price')) {
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
    return stringValue;
  };

  // Calculate sales totals and analytics
  const calculateSalesData = () => {
    if (!data || !data.rows.length) return { 
      totalIncome: 0, 
      ringAnalytics: { colors: {}, sizes: {}, colorSizeCorrelation: {} }
    };
    
    let totalIncome = 0;
    const ringColors: { [key: string]: number } = {};
    const ringSizes: { [key: string]: number } = {};
    const colorSizeCorrelation: { [key: string]: { [key: string]: number } } = {};
    
    data.rows.forEach(row => {
      // Calculate total income (Unit Price * Ordered Quantity)
      const unitPriceCol = data.headers.find(h => 
        h.toLowerCase().includes('unit') && h.toLowerCase().includes('price')
      );
      const quantityCol = data.headers.find(h => 
        h.toLowerCase().includes('order') && h.toLowerCase().includes('quantity')
      );
      
      if (unitPriceCol && quantityCol) {
        const unitPrice = parseFloat(row[unitPriceCol]?.toString() || '0') || 0;
        const quantity = parseFloat(row[quantityCol]?.toString() || '0') || 0;
        totalIncome += unitPrice * quantity;
      }
      
      // Analyze ring types and sizes from "Item Name At Time Of Sale"
      const itemNameCol = data.headers.find(h => 
        h.toLowerCase().includes('item') && h.toLowerCase().includes('name')
      );
      
      if (itemNameCol && row[itemNameCol]) {
        const itemName = row[itemNameCol].toString();
        
        if (itemName.toLowerCase().includes('soma ring')) {
          let color: string | null = null;
          if (itemName.toLowerCase().includes('black')) color = 'Black';
          else if (itemName.toLowerCase().includes('silver')) color = 'Silver';
          else if (itemName.toLowerCase().includes('rose gold')) color = 'Rose Gold';
          
          if (color) {
            ringColors[color] = (ringColors[color] || 0) + 1;
            
            const sizeMatch = itemName.match(/(\d+)\s*\/|(\d+)\s*-/);
            if (sizeMatch) {
              const size = `Size ${sizeMatch[1] || sizeMatch[2]}`;
              ringSizes[size] = (ringSizes[size] || 0) + 1;

              if (!colorSizeCorrelation[color]) {
                colorSizeCorrelation[color] = {};
              }
              colorSizeCorrelation[color][size] = (colorSizeCorrelation[color][size] || 0) + 1;
            }
          }
        }
      }
    });
    
    // Ensure all sizes from 6 to 13 are present for each color
    const allSizes = Array.from({ length: 13 - 6 + 1 }, (_, i) => `Size ${i + 6}`);
    const detectedColors = Object.keys(colorSizeCorrelation);

    detectedColors.forEach(color => {
      const existingSizes = colorSizeCorrelation[color];
      const completeSizes: { [key: string]: number } = {};
      allSizes.forEach(size => {
        completeSizes[size] = existingSizes[size] || 0;
      });
      colorSizeCorrelation[color] = completeSizes;
    });

    // Calculate totals for percentages
    const totalColorsSold = Object.values(ringColors).reduce((sum, count) => sum + count, 0);
    const totalSizesSold = Object.values(ringSizes).reduce((sum, count) => sum + count, 0);
    
    return { 
      totalIncome, 
      ringAnalytics: { 
        colors: ringColors, 
        sizes: ringSizes,
        totalColors: totalColorsSold,
        totalSizes: totalSizesSold,
        colorSizeCorrelation: colorSizeCorrelation
      }
    };
  };

  const salesData = calculateSalesData();
  const usdIncome = exchangeRate ? salesData.totalIncome / exchangeRate : 0;

  // Calculate monthly sales summary
  const calculateMonthlySummary = () => {
    if (!data || !data.rows.length) {
      return {};
    }

    const dateHeader = data.headers.find(h => h.trim().toLowerCase().includes('fecha') || h.trim().toLowerCase().includes('date'));
    const unitPriceCol = data.headers.find(h => h.toLowerCase().includes('unit') && h.toLowerCase().includes('price'));
    const quantityCol = data.headers.find(h => h.toLowerCase().includes('order') && h.toLowerCase().includes('quantity'));

    if (!dateHeader || !unitPriceCol || !quantityCol) {
      return {};
    }

    const monthlySummary: { [month: string]: { totalIncome: number } } = {};

    data.rows.forEach(row => {
      const dateValue = row[dateHeader];
      if (!dateValue) return;

      let date;
      if (typeof dateValue === 'string' && dateValue.startsWith('Date(')) {
        const parts = dateValue.substring(5, dateValue.length - 1).split(',');
        if (parts.length >= 3) {
          const year = parseInt(parts[0]);
          const month = parseInt(parts[1]);
          const day = parseInt(parts[2]);
          date = new Date(Date.UTC(year, month, day));
        } else {
          return;
        }
      } else {
        date = new Date(dateValue);
      }

      if (isNaN(date.getTime())) return;

      const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

      if (!monthlySummary[monthYear]) {
        monthlySummary[monthYear] = { totalIncome: 0 };
      }

      const unitPrice = parseFloat(row[unitPriceCol]?.toString() || '0') || 0;
      const quantity = parseFloat(row[quantityCol]?.toString() || '0') || 0;
      monthlySummary[monthYear].totalIncome += unitPrice * quantity;
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto p-8 text-center">
          <p className="text-red-500 text-lg">Error: {error}</p>
          <p className="text-gray-400 mt-2">Could not fetch sales data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen">
        
        {/* Header and navigation */}
        <header className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-900">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <Image src="/Assets/Soma_Logo.png" alt="Soma Logo" width={50} height={50} />
              <h1 className="ml-4 text-3xl font-bold text-white">Sales Data</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/" className="px-4 py-2 rounded-lg border border-gray-600 text-lg font-medium text-gray-300 hover:bg-gray-700 hover:border-gray-500 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/expenses" className="px-4 py-2 rounded-lg border border-gray-600 text-lg font-medium text-gray-300 hover:bg-gray-700 hover:border-gray-500 hover:text-white transition-colors">
                Expenses
              </Link>
            </nav>
          </div>
        </header>
        
        {/* Content */}
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

          {/* Sales Analytics */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Sales Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Total Income */}
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-300">Total Income</h3>
                </div>
                <p className="text-3xl font-bold text-white mt-2">
                  {formatCurrency(salesData.totalIncome, 'PEN')}
                </p>
                {exchangeRate && (
                  <div className="flex items-center mt-1">
                    <p className="text-sm text-gray-400">
                      (Approx. {formatCurrency(usdIncome, 'USD')})
                    </p>
                    <div className="relative group ml-2">
                      <span className="text-xs text-gray-500 border border-gray-500 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer">?</span>
                      <div className="absolute bottom-full mb-2 w-max max-w-xs px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Converted to USD using an exchange rate of {exchangeRate.toFixed(4)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Ring Colors Breakdown */}
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-300">Ring Sales by Color</h3>
                {salesData.ringAnalytics.totalColors && salesData.ringAnalytics.totalColors > 0 ? (
                  <ul className="mt-2 space-y-1 text-gray-200">
                    {Object.entries(salesData.ringAnalytics.colors).map(([color, count]) => (
                      <li key={color} className="flex justify-between">
                        <span>{color}</span>
                        <span>{count} units ({((count / (salesData.ringAnalytics.totalColors || 1)) * 100).toFixed(1)}%)</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-gray-400 mt-2">No ring color data available.</p>}
              </div>

              {/* Ring Sizes Breakdown */}
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-300">Ring Sales by Size</h3>
                {salesData.ringAnalytics.totalSizes && salesData.ringAnalytics.totalSizes > 0 ? (
                  <ul className="mt-2 space-y-1 text-gray-200">
                    {Object.entries(salesData.ringAnalytics.sizes)
                      .sort(([a], [b]) => parseInt(a.replace('Size ', '')) - parseInt(b.replace('Size ', '')))
                      .map(([size, count]) => (
                      <li key={size} className="flex justify-between">
                        <span>{size}</span>
                        <span>{count} units ({((count / (salesData.ringAnalytics.totalSizes || 1)) * 100).toFixed(1)}%)</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-gray-400 mt-2">No ring size data available.</p>}
              </div>
            </div>
          </section>

          {/* Ring Sales Correlation */}
          {Object.keys(salesData.ringAnalytics.colorSizeCorrelation).length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">Ring Sales Correlation (Color & Size)</h2>
              <div className="overflow-x-auto bg-gray-800 rounded-lg">
                <table className="min-w-full text-left text-sm text-gray-300">
                  <thead className="bg-gray-700">
                    <tr>
                      <th scope="col" className="p-4">Color</th>
                      {Object.keys(Object.values(salesData.ringAnalytics.colorSizeCorrelation)[0] || {}).map(size => (
                        <th scope="col" key={size} className="p-4 text-center">{size}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(salesData.ringAnalytics.colorSizeCorrelation).map(([color, sizes]) => (
                      <tr key={color} className="border-b border-gray-700">
                        <td className="p-4 font-semibold">{color}</td>
                        {Object.entries(sizes)
                          .sort(([a], [b]) => parseInt(a.replace('Size ', '')) - parseInt(b.replace('Size ', '')))
                          .map(([size, count]) => (
                          <td key={size} className="p-4 text-center">{count}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Monthly Summary Table */}
          {Object.keys(monthlySummary).length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">Monthly Summary</h2>
              <div className="overflow-x-auto bg-gray-800 rounded-lg">
                <table className="min-w-full text-left text-sm text-gray-300">
                  <thead className="bg-gray-700">
                    <tr>
                      <th scope="col" className="p-4">Month</th>
                      <th scope="col" className="p-4">Total Income</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(monthlySummary).map(([month, summary]) => (
                      <tr key={month} className="border-b border-gray-700">
                        <td className="p-4 font-semibold">{month}</td>
                        <td className="p-4">{formatCurrency(summary.totalIncome, 'PEN')}</td>
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
              <h2 className="text-2xl font-bold mb-4 text-white">Raw Sales Data</h2>
              <div id="sales-table-container" className="overflow-x-auto bg-gray-800 rounded-lg">
                <div id="scroll-indicator-container" className="sticky top-0 h-1 bg-gray-700 rounded-lg overflow-hidden">
                  <div id="scroll-indicator" className="h-1 bg-cyan-400" style={{ position: 'relative', width: '10%' }}></div>
                </div>
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
              <p className="text-gray-400">No sales data available.</p>
            </div>
          )}
        </div>
      </main>
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full shadow-lg transition-opacity hover:opacity-90 z-20"
          style={{ backgroundColor: 'var(--soma-petroleo)', color: 'var(--soma-aquamarina)' }}
          aria-label="Go to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </>
  );
} 