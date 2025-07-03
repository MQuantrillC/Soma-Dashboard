"use client";

import React, { useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Info } from 'lucide-react';
import { DcfMonth } from '@/utils/calculateDcf';
import Tooltip from '@/components/Tooltip';

interface DcfResultsProps {
  dcfData: DcfMonth[];
  outputCurrency: 'USD' | 'PEN';
  exchangeRate: number;
  applyTax: boolean;
  discountRate: number;
  inputs: {
    startUnits: number;
    growthRate: number;
    unitPrice: number;
    unitPriceCurrency: 'USD' | 'PEN';
  };
  unitCostInPen: number;
}

const StatCard = ({ title, value, tooltipText }: { title: string, value: string, tooltipText?: string }) => (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg flex items-center">
      <div className="bg-soma-aquamarina/20 p-3 rounded-full mr-4">
        <DollarSign className="w-6 h-6 text-soma-aquamarina" />
      </div>
      <div>
        <div className="flex items-center gap-2">
            <p className="text-sm text-gray-300 font-medium">{title}</p>
            {tooltipText && (
                <Tooltip text={tooltipText}>
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
            )}
        </div>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
);

const DcfResults: React.FC<DcfResultsProps> = ({ dcfData, outputCurrency, exchangeRate, applyTax, discountRate, inputs, unitCostInPen }) => {
    
    const formatCurrency = useCallback((value: number) => {
        const displayValue = outputCurrency === 'USD' ? value / exchangeRate : value;
        const symbol = outputCurrency === 'USD' ? '$' : 'S/.';
        return `${symbol}${displayValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }, [outputCurrency, exchangeRate]);
    
    const settingsSummary = useMemo(() => {
        if (!inputs) return "";
        const price = formatCurrency(inputs.unitPriceCurrency === 'USD' ? inputs.unitPrice * exchangeRate : inputs.unitPrice);
        const cost = formatCurrency(unitCostInPen);
        return `Calculations based on a unit price of ${price}, a unit cost of ${cost}, and starting sales of ${inputs.startUnits} units, growing at ${inputs.growthRate}% monthly.`;
    }, [inputs, unitCostInPen, exchangeRate, formatCurrency]);

    const yAxisDomain = useMemo(() => {
        if (!dcfData || dcfData.length === 0) return [0, 0];
        const monthlyDiscountRate = Math.pow(1 + discountRate / 100, 1 / 12) - 1;
        const maxDiscountedProfit = Math.max(
            ...dcfData.map((month, index) => month.profit / Math.pow(1 + monthlyDiscountRate, index + 1))
        );
        return [0, maxDiscountedProfit * 1.1]; // Add 10% padding
    }, [dcfData, discountRate]);

    if (!dcfData || dcfData.length === 0) return null;

    const npv = dcfData[dcfData.length - 1].cumulativeNpv;

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-bold font-saira text-white">DCF Analysis</h2>

            <p className="text-sm text-gray-400 italic">{settingsSummary}</p>
            
            <StatCard 
                title="Net Present Value (NPV)" 
                value={formatCurrency(npv)}
                tooltipText="Net Present Value: the total worth today of all future profits, adjusted for tax and discount rate."
            />
            
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-96">
                <h3 className="text-lg font-bold mb-4 font-saira text-white">Discounted Monthly Profit</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={dcfData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" vertical={false} />
                        <XAxis dataKey="month" tick={{ fill: '#A0AEC0' }} tickFormatter={(value) => `M${value}`} />
                        <YAxis 
                            tick={{ fill: '#A0AEC0' }} 
                            tickFormatter={(value) => formatCurrency(value as number)}
                            domain={yAxisDomain}
                        />
                        <RechartsTooltip
                            cursor={{ fill: 'rgba(144, 205, 244, 0.1)' }}
                            contentStyle={{ backgroundColor: 'rgba(26, 32, 44, 0.9)', border: '1px solid #4A5568' }}
                            formatter={(value: number) => [formatCurrency(value), 'Discounted Profit']}
                        />
                        <Bar dataKey="discountedProfit" name="Discounted Profit" fill="#006D5A" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div className="overflow-x-auto bg-gray-800 p-4 rounded-xl shadow-lg">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="border-b border-gray-700 font-bold tracking-wider">
                        <tr>
                            <th className="p-3">Month</th>
                            <th className="p-3">Gross Profit</th>
                            {applyTax && <th className="p-3">Taxed Profit</th>}
                            <th className="p-3">Discounted Profit</th>
                            <th className="p-3">Cumulative NPV</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dcfData.map(month => (
                            <tr key={month.month} className="border-b border-gray-700/50 hover:bg-gray-700/50">
                                <td className="p-3">{month.month}</td>
                                <td className="p-3">{formatCurrency(month.profit)}</td>
                                {applyTax && <td className="p-3">{formatCurrency(month.taxedProfit)}</td>}
                                <td className="p-3">{formatCurrency(month.discountedProfit)}</td>
                                <td className="p-3">{formatCurrency(month.cumulativeNpv)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DcfResults; 