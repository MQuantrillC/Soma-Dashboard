"use client";

import React from 'react';
import { Check, Link as LinkIcon } from 'lucide-react';

const competitors = [
  {
    name: 'SOMA',
    features: {
      hrv: true,
      sleep: true,
      battery: '6',
      app: true,
      price: '~$150',
      link: null,
    },
  },
  {
    name: 'Oura',
    features: {
      hrv: true,
      sleep: true,
      battery: '7',
      app: true,
      price: '$349–$499',
      link: 'https://ouraring.com/product/rings/oura-ring-4/black',
    },
  },
  {
    name: 'Whoop',
    features: {
      hrv: true,
      sleep: true,
      battery: '5',
      app: true,
      price: '$199+/yr',
      link: 'https://join.whoop.com/us/en/',
    },
  },
  {
    name: 'Ultrahuman',
    features: {
      hrv: true,
      sleep: true,
      battery: '6',
      app: true,
      price: '$349',
      link: 'https://www.ultrahuman.com/ring/buy/global/',
    },
  },
  {
    name: 'Circular',
    features: {
      hrv: true,
      sleep: true,
      battery: '5',
      app: true,
      price: '$249–$550',
      link: 'https://www.kickstarter.com/projects/circular-ring/circular-ring-2-worlds-most-advanced-health-tracking-ring?ref=cnttqy&utm_source=website&utm_medium=button',
    },
  },
];

const features = [
  { key: 'hrv', name: 'HRV Tracking' },
  { key: 'sleep', name: 'Sleep Analytics' },
  { key: 'app', name: 'App Integration' },
  { key: 'battery', name: 'Battery Life (days)' },
  { key: 'price', name: 'Price (USD)' },
  { key: 'link', name: 'Link to Buy' },
];

const CompetitorTable = () => {
  return (
    <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg overflow-x-auto">
      <table className="min-w-full text-left text-sm whitespace-nowrap">
        <thead className="border-b border-gray-700 font-bold tracking-wider">
          <tr>
            <th className="p-3">Feature</th>
            {competitors.map(c => <th key={c.name} className="p-3 text-center">{c.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {features.map(feature => (
            <tr key={feature.key} className="border-b border-gray-700/50">
              <td className="p-3 font-medium">{feature.name}</td>
              {competitors.map(competitor => (
                <td key={`${competitor.name}-${feature.key}`} className="p-3 text-center text-gray-300">
                  {renderFeature(competitor.features[feature.key as keyof typeof competitor.features], feature.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const renderFeature = (value: string | boolean | null, key: string) => {
    if (key === 'link' && typeof value === 'string') {
        return (
            <a href={value} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center text-soma-aquamarina hover:text-soma-aquamarina/80 transition-colors">
                <LinkIcon className="w-4 h-4" />
            </a>
        );
    }
    if (typeof value === 'boolean' && value) {
        return <Check className="w-5 h-5 text-green-400 mx-auto" />;
    }
    if (value === null || (typeof value === 'boolean' && !value)) {
        return '—';
    }
    return value;
}

export default CompetitorTable; 