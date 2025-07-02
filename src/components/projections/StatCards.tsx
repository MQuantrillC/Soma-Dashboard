"use client";

import React from 'react';
import { ProjectionMonth } from '@/utils/calculateProjections';
import { DollarSign, TrendingUp, ShoppingCart, Percent } from 'lucide-react';

interface StatCardsProps {
  data: ProjectionMonth[];
  outputCurrency: 'USD' | 'PEN';
  exchangeRate: number;
}

interface StatCardProps {
    title: string;
    value: string; // Value is now a pre-formatted string
    icon: React.ElementType;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg flex items-center">
      <div className="bg-soma-aquamarina/20 p-3 rounded-full mr-4">
        <Icon className="w-6 h-6 text-soma-aquamarina" />
      </div>
      <div>
        <p className="text-sm text-gray-300 font-medium">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

const StatCards: React.FC<StatCardsProps> = ({ data, outputCurrency, exchangeRate }) => {
  if (!data || data.length === 0) {
    return null; // Or show a placeholder
  }

  const formatOutputCurrency = (penValue: number) => {
    const value = outputCurrency === 'USD' ? penValue / exchangeRate : penValue;
    const symbol = outputCurrency === 'USD' ? '$' : 'S/.';
    return `${symbol}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const totals = data.reduce(
    (acc, month) => {
      acc.revenue += month.revenue;
      acc.profit += month.profit;
      acc.units += month.units;
      return acc;
    },
    { revenue: 0, profit: 0, units: 0 }
  );

  const profitMargin = totals.revenue > 0 ? (totals.profit / totals.revenue) * 100 : 0;
  const profitPerUnit = totals.units > 0 ? totals.profit / totals.units : 0;
  
  // A simple MoM growth calculation (can be improved)
  const firstMonthUnits = data[0]?.units || 0;
  const lastMonthUnits = data[data.length - 1]?.units || 0;
  const averageMoMGrowth = data.length > 1 ? ((Math.pow(lastMonthUnits / firstMonthUnits, 1 / (data.length - 1)) - 1) * 100) : 0;


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      <StatCard title="Total Revenue" value={formatOutputCurrency(totals.revenue)} icon={DollarSign} />
      <StatCard title="Total Profit" value={formatOutputCurrency(totals.profit)} icon={TrendingUp} />
      <StatCard title="Profit per Unit" value={formatOutputCurrency(profitPerUnit)} icon={DollarSign} />
      <StatCard title="Total Units Sold" value={new Intl.NumberFormat('en-US').format(totals.units)} icon={ShoppingCart} />
      <StatCard title="Profit Margin" value={`${profitMargin.toFixed(1)}%`} icon={Percent} />
      <StatCard title="Avg. MoM Growth" value={`${averageMoMGrowth.toFixed(1)}%`} icon={TrendingUp} />
    </div>
  );
};

export default StatCards; 