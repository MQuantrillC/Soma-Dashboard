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

        // Format to 'DD Mon YYYY, HH:mm'
        return date.toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'UTC'
        }).replace(',', '');
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--soma-blanco)' }}>
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--soma-aquamarina)' }}></div>
            <span className="ml-4 body-text" style={{ color: 'var(--soma-petroleo)' }}>Loading sales data...</span>
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
              <Image src="/Assets/Soma_Logo_Black.png" alt="Soma Logo" width={32} height={32} />
              <h1 className="heading-h1 font-bold" style={{ color: '#015965' }}>Sales Data</h1>
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
        {/* Totals and Analytics Section */}
        {data && data.rows.length > 0 && (
          <div className="mb-8 space-y-6">
            {/* Total Income - Both PEN and USD */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Total Income in PEN */}
              <div className="rounded-xl shadow-lg p-6 border-2" style={{ backgroundColor: '#2FFFCC', borderColor: '#015965' }}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#015965' }}>
                      <span className="button-text font-bold" style={{ color: '#2FFFCC' }}>S/</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="small-text" style={{ color: '#015965' }}>Total Income (PEN)</p>
                    <p className="text-3xl font-bold" style={{ color: '#015965' }}>
                      S/{salesData.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Income in USD */}
              <div className="rounded-xl shadow-lg p-6 border-2" style={{ backgroundColor: '#2FFFCC', borderColor: '#015965' }}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#015965' }}>
                      <span className="button-text font-bold" style={{ color: '#2FFFCC' }}>$</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="small-text" style={{ color: '#015965' }}>Total Income (USD)</p>
                    <p className="text-3xl font-bold" style={{ color: '#015965' }}>
                      ${(salesData.totalIncome / (exchangeRate || 3.5)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ring Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Ring Colors Sold */}
              <div className="rounded-xl shadow-lg p-6 border-2" style={{ backgroundColor: '#2FFFCC', borderColor: '#015965' }}>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#015965' }}>Ring Colors Sold</h3>
                <div className="space-y-3">
                  {Object.entries(salesData.ringAnalytics.colors).map(([color, count]) => {
                    const totalColors = salesData.ringAnalytics.totalColors || 0;
                    const percentage = totalColors > 0 
                      ? ((count / totalColors) * 100).toFixed(1)
                      : '0.0';
                    return (
                      <div key={color} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-3`} style={{
                            border: `2px solid ${
                              color === 'Black' ? '#051F22' :
                              color === 'Silver' ? '#C0C0C0' :
                              color === 'Rose Gold' ? '#E0BFB8' :
                              '#015965'
                            }`
                          }}></div>
                          <span className="body-text" style={{ color: '#015965' }}>Soma Ring - {color}</span>
                        </div>
                        <span className="body-medium" style={{ color: '#015965' }}>
                          {count}
                          <span className="text-sm opacity-70 ml-2">({percentage}%)</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ring Sizes Sold */}
              <div className="rounded-xl shadow-lg p-6 border-2" style={{ backgroundColor: '#2FFFCC', borderColor: '#015965' }}>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#015965' }}>Ring Sizes Sold</h3>
                <div className="space-y-3">
                  {Object.entries(salesData.ringAnalytics.sizes)
                    .sort(([a], [b]) => {
                      const numA = parseInt(a.replace('Size ', ''));
                      const numB = parseInt(b.replace('Size ', ''));
                      return numA - numB;
                    })
                    .map(([size, count]) => {
                      const totalSizes = salesData.ringAnalytics.totalSizes || 0;
                      const percentage = totalSizes > 0
                        ? ((count / totalSizes) * 100).toFixed(1)
                        : '0.0';
                      return (
                        <div key={size} className="flex items-center justify-between">
                          <span className="body-text" style={{ color: '#015965' }}>{size}</span>
                          <span className="body-medium" style={{ color: '#015965' }}>
                            {count}
                            <span className="text-sm opacity-70 ml-2">({percentage}%)</span>
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Ring Color-Size Correlation */}
            <div className="mt-8 text-center">
              <h3 className="text-3xl font-bold text-center mb-6" style={{ color: '#2FFFCC' }}>
                Ring Sales Correlation (Color & Size)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {Object.entries(salesData.ringAnalytics.colorSizeCorrelation).map(([color, sizes]) => (
                  <div key={color} className="rounded-xl shadow-lg p-6 border-2" style={{
                    backgroundColor: '#2FFFCC',
                    borderColor: '#015965'
                  }}>
                    <div className="flex items-center mb-4">
                       <div className={`w-6 h-6 rounded-full mr-3`} style={{
                         border: `3px solid ${
                           color === 'Black' ? '#051F22' :
                           color === 'Silver' ? '#C0C0C0' :
                           color === 'Rose Gold' ? '#E0BFB8' :
                           '#015965'
                         }`
                       }}></div>
                      <h4 className="text-2xl font-bold" style={{ color: '#015965' }}>
                        {color} Rings
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(sizes)
                        .sort(([sizeA], [sizeB]) => {
                           const numA = parseInt(sizeA.replace('Size ', ''));
                           const numB = parseInt(sizeB.replace('Size ', ''));
                           return numA - numB;
                        })
                        .map(([size, count]) => (
                        <div key={size} className="flex justify-between items-center">
                          <span className="body-text" style={{ color: '#015965' }}>{size}</span>
                          <span className="body-medium font-bold" style={{ color: '#015965' }}>{count} sold</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {data && data.rows.length > 0 ? (
                      <div className="rounded-xl shadow-lg overflow-hidden border-2" style={{ 
              backgroundColor: 'var(--soma-blanco)', 
              borderColor: 'var(--soma-petroleo)' 
            }}>
            
            {/* Horizontal scroll indicator at top */}
            <div className="relative mb-4 px-6 pt-4">
              <div className="h-3 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--soma-petroleo)', opacity: 0.3 }}>
                <div 
                  id="scroll-indicator"
                  className="h-full rounded-lg transition-all duration-150 ease-out"
                  style={{width: '20%', position: 'relative', left: '0%', backgroundColor: 'var(--soma-aquamarina)'}}
                ></div>
              </div>
              <p className="small-text mt-1" style={{ color: 'var(--soma-petroleo)' }}>← Scroll horizontally to view all columns →</p>
            </div>
            
            <div className="overflow-x-auto px-6 pb-6" id="sales-table-container">
              <table className="min-w-full">
                <thead>
                  <tr>
                    {data.headers.map((header, index) => (
                      <th 
                        key={index}
                        className="sticky top-0 px-4 py-4 text-left small-text font-bold uppercase tracking-wider whitespace-nowrap border-b-2"
                        style={{ color: '#2FFFCC', borderColor: '#2FFFCC', backgroundColor: '#015965' }}
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
                          {formatValue(row[header], header)}
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
            <div className="text-gray-400 text-6xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Sales Data</h3>
            <p className="text-gray-600">No sales records were found in the Google Sheet.</p>
          </div>
        )}
      </div>
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
    </div>
  );
} 