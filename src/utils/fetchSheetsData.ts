// Google Sheets data fetching utility
// Uses the gviz/tq endpoint to fetch data from public Google Sheets

import React from 'react';

const SHEET_ID = '1SpRx2lMEunxSvkbgfq2-lHWUbGamBVK_-yBzdvxvyu8';
const BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq`;

export interface SheetRow {
  [key: string]: string | number | null;
}

export interface SheetData {
  headers: string[];
  rows: SheetRow[];
}

interface GSheetCol {
  id: string;
  label: string;
  type: string;
}

interface GSheetCell {
  v: string | number | null;
}

interface GSheetRow {
  c: GSheetCell[] | null;
}

/**
 * Fetches data from a specific sheet in the Google Sheets document
 * @param sheetName - The name of the sheet to fetch data from
 * @param range - Optional range (e.g., 'A1:F100')
 * @returns Promise<SheetData> - Object containing headers and rows
 */
export async function fetchSheetData(
  sheetName: string,
  range?: string
): Promise<SheetData> {
  try {
    const url = new URL(BASE_URL);
    url.searchParams.append('sheet', sheetName);
    if (range) {
      url.searchParams.append('range', range);
    }
    url.searchParams.append('tqx', 'out:json');

    const response = await fetch(url.toString(), { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.statusText} (${response.status})`);
    }

    const text = await response.text();
    
    // The response is wrapped in a function call, so we need to extract the JSON.
    // The response may start with "/*O_o*/"
    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}') + 1;

    if (jsonStartIndex === -1 || jsonEndIndex === 0) {
      console.error('Unexpected response from Google Sheets API:', text);
      throw new Error('Received an unexpected response from Google Sheets API. The sheet might not be public or the API may have changed.');
    }

    const jsonText = text.substring(jsonStartIndex, jsonEndIndex);
    
    let data;
    try {
      data = JSON.parse(jsonText);
    } catch {
      console.error('Failed to parse JSON from Google Sheets response:', jsonText);
      throw new Error('Failed to parse JSON response from Google Sheets.');
    }

    if (data.status === 'error') {
      throw new Error(`Google Sheets API error: ${data.errors[0].detailed_message}`);
    }

    const table = data.table;
    const cols: GSheetCol[] = table.cols;
    const rawRows: GSheetRow[] = table.rows || [];

    // Identify indices of non-empty columns
    const nonEmptyColIndices: number[] = [];
    cols.forEach((col: GSheetCol, index: number) => {
      const header = (col.label || col.id || '').trim();
      
      // A column is considered empty if its header is a single letter (like Q, R, S)
      // AND it has no data. This is to filter out default, empty columns from Google Sheets.
      const isDefaultHeader = /^[A-Z]$/.test(header);

      const hasData = rawRows.some(row => 
        row.c && row.c[index] && row.c[index].v !== null && row.c[index].v !== ''
      );
      
      // If the header is a default header and there is no data, skip it.
      if (isDefaultHeader && !hasData) {
        return;
      }
      
      // Otherwise, keep the column.
      nonEmptyColIndices.push(index);
    });

    // Filter headers and rows based on non-empty indices
    const headers: string[] = nonEmptyColIndices.map(index => 
      cols[index].label || cols[index].id || ''
    );

    const rows: SheetRow[] = rawRows
      .map((row: GSheetRow) => {
        const rowData: SheetRow = {};
        if (row && row.c) {
          nonEmptyColIndices.forEach((colIndex, i) => {
            const header = headers[i];
            if (header) {
              const cell = row.c?.[colIndex];
              rowData[header] = cell?.v ?? null;
            }
          });
        }
        return rowData;
      })
      .filter(rowData =>
        Object.values(rowData).some(val => val !== null && val !== '')
      );

    return { headers, rows };
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
}

/**
 * Fetches the USD to PEN exchange rate from cell B2 of the XR sheet
 * @returns Promise<number> - The exchange rate
 */
export async function fetchExchangeRate(): Promise<number> {
  try {
    const data = await fetchSheetData('XR', 'B2');
    
    if (data.rows.length === 0 || !data.rows[0]) {
      throw new Error('No exchange rate data found in XR sheet');
    }

    // Get the first non-null value from the first row
    const rate = Object.values(data.rows[0]).find(value => value !== null);
    
    if (typeof rate !== 'number' && typeof rate !== 'string') {
      throw new Error('Invalid exchange rate format');
    }

    const numericRate = typeof rate === 'string' ? parseFloat(rate) : rate;
    
    if (isNaN(numericRate)) {
      throw new Error('Exchange rate is not a valid number');
    }

    return numericRate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
  }
}

/**
 * Hook to fetch and cache exchange rate
 * Note: This is kept for reference but should be used in client components
 */
export function useExchangeRate() {
  const [rate, setRate] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchExchangeRate()
      .then(setRate)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { rate, loading, error };
} 