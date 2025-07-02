"use client";

import React from 'react';
import { ChevronDown, Info } from 'lucide-react';
import Tooltip from '@/components/Tooltip';

interface AdvancedSettingsProps {
  isAdvancedOpen: boolean;
  setIsAdvancedOpen: React.Dispatch<React.SetStateAction<boolean>>;
  discountRate: number;
  setDiscountRate: (value: number) => void;
  taxRate: number;
  setTaxRate: (value: number) => void;
  applyTax: boolean;
  setApplyTax: (value: boolean) => void;
}

const OnOffToggle = ({ value, setValue }: { value: boolean, setValue: (value: boolean) => void }) => (
    <div className="inline-flex items-center text-sm rounded-md border border-gray-600">
        <button
            onClick={() => setValue(true)}
            className={`px-4 py-2 rounded-l-md transition-colors ${value ? 'bg-soma-aquamarina text-soma-petroleo font-bold' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
            ON
        </button>
        <button
            onClick={() => setValue(false)}
            className={`px-4 py-2 rounded-r-md transition-colors ${!value ? 'bg-soma-aquamarina text-soma-petroleo font-bold' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
            OFF
        </button>
    </div>
);

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  isAdvancedOpen,
  setIsAdvancedOpen,
  discountRate,
  setDiscountRate,
  taxRate,
  setTaxRate,
  applyTax,
  setApplyTax
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <button
        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        className="w-full flex justify-between items-center text-left text-xl font-bold font-saira text-white"
      >
        <div className="flex items-center gap-2">
            <span>Advanced Settings</span>
            <Tooltip text="The Discounted Cash Flow model calculates the present value of expected future profits, helping estimate the project's true financial value." align="left">
                <Info className="w-5 h-5 text-gray-400 cursor-help" />
            </Tooltip>
        </div>
        <ChevronDown
          className={`w-6 h-6 transition-transform ${
            isAdvancedOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isAdvancedOpen && (
        <div className="mt-6 border-t border-gray-700 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <label className="block">
              <span className="text-gray-300 font-medium">Discount Rate (%)</span>
              <input
                type="text"
                inputMode="decimal"
                value={discountRate || ''}
                onChange={e => setDiscountRate(parseFloat(e.target.value) || 0)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-soma-aquamarina focus:ring focus:ring-soma-aquamarina focus:ring-opacity-50"
              />
            </label>

            <label className="block">
              <span className="text-gray-300 font-medium">Tax Rate (%)</span>
              <input
                type="text"
                inputMode="decimal"
                value={taxRate || ''}
                onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}
                disabled={!applyTax}
                className={`mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-soma-aquamarina focus:ring focus:ring-soma-aquamarina focus:ring-opacity-50 ${
                  !applyTax ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
            </label>
            
            <div className="flex flex-col items-start">
                <span className="text-gray-300 font-medium mb-2">Apply Tax</span>
                <OnOffToggle value={applyTax} setValue={setApplyTax} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSettings; 