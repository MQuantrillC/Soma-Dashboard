"use client";

import React from 'react';
import { ProjectionMonth } from '@/utils/calculateProjections';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ProjectionChartProps {
  data: ProjectionMonth[];
  outputCurrency: 'USD' | 'PEN';
  exchangeRate: number;
}

const ProjectionChart: React.FC<ProjectionChartProps> = ({ data, outputCurrency, exchangeRate }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-96">
       <h2 className="text-xl font-bold mb-4 font-saira text-white">Financial Projections</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" vertical={false} />
          <XAxis 
            dataKey="month" 
            label={{ value: 'Month', position: 'insideBottom', offset: -15, fill: '#A0AEC0' }}
            tick={{ fill: '#A0AEC0' }}
            tickFormatter={(value) => `M${value}`}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#A0AEC0' }}
            tickFormatter={(value: number) => {
              const displayValue = outputCurrency === 'USD' ? value / exchangeRate : value;
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                notation: 'compact',
              }).format(displayValue)
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(26, 32, 44, 0.8)',
              backdropFilter: 'blur(4px)',
              border: '1px solid #4A5568',
              borderRadius: '0.5rem',
              color: '#FFF'
            }}
            formatter={(value: number, name: string) => {
              const displayValue = outputCurrency === 'USD' ? value / exchangeRate : value;
              const symbol = outputCurrency === 'USD' ? '$' : 'S/.';
              const formattedValue = `${symbol}${displayValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              return [formattedValue, name.charAt(0).toUpperCase() + name.slice(1)]
            }}
          />
          <Legend
            wrapperStyle={{ bottom: 0 }}
            formatter={(value) => <span style={{ color: '#FFF' }}>{value}</span>}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#006D5A"
            strokeWidth={3}
            dot={{ r: 4, fill: '#006D5A' }}
            activeDot={{ r: 8 }}
          />
          <Line 
            type="monotone" 
            dataKey="profit"
            name="Profit"
            stroke="#2FFFCC" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#2FFFCC' }}
          />
          <Line 
            type="monotone" 
            dataKey="cost"
            name="Total Cost"
            stroke="#E53E3E" 
            strokeWidth={2}
            strokeDasharray="3 3"
            dot={{ r: 4, fill: '#E53E3E' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectionChart; 