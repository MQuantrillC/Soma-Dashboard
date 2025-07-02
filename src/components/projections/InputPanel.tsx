"use client";

import React, { useMemo, useCallback } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import { ProjectionInputs } from '@/utils/calculateProjections';
import { CostComponent } from '@/app/projections/page';

interface InputPanelProps {
  inputs: {
    startUnits: number;
    growthRate: number;
    unitPrice: number;
    unitPriceCurrency: 'USD' | 'PEN';
    timeFrame: number;
  };
  setInputs: React.Dispatch<React.SetStateAction<InputPanelProps['inputs']>>;
  costComponents: CostComponent[];
  setCostComponents: React.Dispatch<React.SetStateAction<CostComponent[]>>;
  isCostBreakdownOpen: boolean;
  setIsCostBreakdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  manualUnitCost: { value: number; currency: 'USD' | 'PEN' };
  setManualUnitCost: React.Dispatch<React.SetStateAction<{ value: number; currency: 'USD' | 'PEN' }>>;
  exchangeRate: number;
  setExchangeRate: React.Dispatch<React.SetStateAction<number>>;
}

const CurrencyToggle = ({ currency, setCurrency }: { currency: 'USD' | 'PEN', setCurrency: (currency: 'USD' | 'PEN') => void }) => (
    <div className="flex items-center text-xs rounded-md border border-gray-600">
        <button onClick={() => setCurrency('USD')} className={`px-2 py-1 rounded-l-md transition-colors ${currency === 'USD' ? 'bg-soma-aquamarina text-soma-petroleo font-bold' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}>USD</button>
        <button onClick={() => setCurrency('PEN')} className={`px-2 py-1 rounded-r-md transition-colors ${currency === 'PEN' ? 'bg-soma-aquamarina text-soma-petroleo font-bold' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}>PEN</button>
    </div>
);

let costId = 4; // Start after existing ones

const InputPanel: React.FC<InputPanelProps> = ({
  inputs,
  setInputs,
  costComponents,
  setCostComponents,
  isCostBreakdownOpen,
  setIsCostBreakdownOpen,
  manualUnitCost,
  setManualUnitCost,
  exchangeRate,
  setExchangeRate
}) => {

  const handleInputChange = (field: keyof typeof inputs, value: number | string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleNumberInputChange = (field: keyof InputPanelProps['inputs'], value: string) => {
    const num = parseInt(value, 10);
    handleInputChange(field, isNaN(num) ? 0 : num);
  };

  const handleFloatInputChange = (field: keyof InputPanelProps['inputs'], value: string) => {
    const num = parseFloat(value);
    handleInputChange(field, isNaN(num) ? 0 : num);
  };

  const addCostComponent = useCallback(() => {
    setCostComponents(prev => [...prev, { id: costId++, name: 'New Cost', value: 0, currency: 'USD' }]);
  }, [setCostComponents]);

  const removeCostComponent = useCallback((id: number) => {
    setCostComponents(prev => prev.filter(c => c.id !== id));
  }, [setCostComponents]);

  const updateCostComponent = useCallback((id: number, field: keyof Omit<CostComponent, 'id'>, value: string | number) => {
    setCostComponents(prev =>
      prev.map(c => (c.id === id ? { ...c, [field]: value } : c))
    );
  }, [setCostComponents]);

  const unitCostFromComponents = useMemo(() => {
    return costComponents.reduce((total, component) => {
        const valueInManualCurrency = component.currency === manualUnitCost.currency 
            ? component.value
            : component.currency === 'USD'
            ? component.value * exchangeRate
            : component.value / exchangeRate;
        return total + valueInManualCurrency;
    }, 0)
  }, [costComponents, manualUnitCost.currency, exchangeRate]);

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 font-saira text-white">Projection Inputs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Input Fields */}
        <label className="block">
          <span className="text-gray-300 font-medium">Units Sold</span>
          <input
            type="text"
            inputMode="numeric"
            value={inputs.startUnits || ''}
            onChange={e => handleNumberInputChange('startUnits', e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-soma-aquamarina focus:ring focus:ring-soma-aquamarina focus:ring-opacity-50"
          />
        </label>
        
        <label className="block">
          <span className="text-gray-300 font-medium">Monthly Growth Rate (%)</span>
          <input
            type="text"
            inputMode="numeric"
            value={inputs.growthRate || ''}
            onChange={e => handleNumberInputChange('growthRate', e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-soma-aquamarina focus:ring focus:ring-soma-aquamarina focus:ring-opacity-50"
          />
        </label>

        <label className="block">
            <span className="text-gray-300 font-medium">Unit Price</span>
            <div className="flex items-center mt-1 gap-2">
                <input
                    type="text"
                    inputMode="decimal"
                    value={inputs.unitPrice || ''}
                    onChange={e => handleFloatInputChange('unitPrice', e.target.value)}
                    className="block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-soma-aquamarina focus:ring focus:ring-soma-aquamarina focus:ring-opacity-50"
                />
                <CurrencyToggle currency={inputs.unitPriceCurrency} setCurrency={(c: 'USD' | 'PEN') => handleInputChange('unitPriceCurrency', c)} />
            </div>
        </label>

        {/* Unit Cost Section */}
        <div className="md:col-span-1">
          <label className="block">
            <span className="text-gray-300 font-medium">Unit Cost</span>
             <div className="flex items-center mt-1 gap-2">
                <input
                type="text"
                inputMode="decimal"
                value={isCostBreakdownOpen ? unitCostFromComponents.toFixed(2) : (manualUnitCost.value || '')}
                onChange={e => setManualUnitCost(prev => ({...prev, value: parseFloat(e.target.value) || 0}))}
                readOnly={isCostBreakdownOpen}
                className={`block w-full rounded-md border-gray-600 text-white shadow-sm focus:border-soma-aquamarina focus:ring focus:ring-soma-aquamarina focus:ring-opacity-50 ${isCostBreakdownOpen ? 'bg-gray-900 cursor-not-allowed' : 'bg-gray-700'}`}
                />
                {!isCostBreakdownOpen && (
                    <CurrencyToggle currency={manualUnitCost.currency} setCurrency={(c: 'USD' | 'PEN') => setManualUnitCost(prev => ({ ...prev, currency: c }))} />
                )}
            </div>
          </label>
          <button
            onClick={() => setIsCostBreakdownOpen(!isCostBreakdownOpen)}
            className="text-sm text-soma-aquamarina font-semibold mt-2 flex items-center"
          >
            <ChevronDown className={`w-4 h-4 mr-1 transition-transform ${isCostBreakdownOpen ? 'rotate-180' : ''}`} />
            Specify Costs
          </button>
        </div>

        <label className="block">
          <span className="text-gray-300 font-medium">Time Frame (Months)</span>
          <input
            type="range"
            min="3"
            max="24"
            value={inputs.timeFrame}
            onChange={e => handleInputChange('timeFrame', Number(e.target.value))}
            className="mt-1 block w-full"
          />
          <div className="text-center font-semibold text-gray-400">{inputs.timeFrame} months</div>
        </label>

        {/* Exchange Rate Input */}
        <label className="block">
            <span className="text-gray-300 font-medium">Exchange Rate (USD to PEN)</span>
            <input
                type="text"
                inputMode="decimal"
                value={exchangeRate || ''}
                onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-soma-aquamarina focus:ring focus:ring-soma-aquamarina focus:ring-opacity-50"
            />
        </label>
      </div>
      
      {/* Collapsible Cost Breakdown */}
      {isCostBreakdownOpen && (
        <div className="mt-6 border-t border-gray-700 pt-6">
          <h3 className="text-lg font-bold mb-4 font-saira text-white">Cost Breakdown</h3>
          <div className="space-y-4">
            {costComponents.map((cost) => (
              <div key={cost.id} className="flex items-center gap-4">
                <input
                  type="text"
                  value={cost.name}
                  onChange={e => updateCostComponent(cost.id, 'name', e.target.value)}
                  placeholder="Cost Name"
                  className="block w-1/2 rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-soma-aquamarina focus:ring focus:ring-soma-aquamarina focus:ring-opacity-50"
                />
                <div className="relative flex items-center w-1/2 gap-2">
                  <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">$</span>
                    <input
                        type="text"
                        inputMode="decimal"
                        value={cost.value || ''}
                        onChange={e => updateCostComponent(cost.id, 'value', parseFloat(e.target.value) || 0)}
                        className="pl-7 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-soma-aquamarina focus:ring focus:ring-soma-aquamarina focus:ring-opacity-50"
                    />
                  </div>
                  <CurrencyToggle currency={cost.currency} setCurrency={(c: 'USD' | 'PEN') => updateCostComponent(cost.id, 'currency', c)} />
                </div>
                <button onClick={() => removeCostComponent(cost.id)} className="text-red-500 hover:text-red-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addCostComponent}
            className="mt-4 flex items-center text-soma-aquamarina font-bold"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Cost Type
          </button>
        </div>
      )}
    </div>
  );
};

export default InputPanel; 