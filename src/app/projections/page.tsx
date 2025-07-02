"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ChevronUp } from 'lucide-react';
import InputPanel from '@/components/projections/InputPanel';
import StatCards from '@/components/projections/StatCards';
import ProjectionChart from '@/components/projections/ProjectionChart';
import AdvancedSettings from '@/components/projections/AdvancedSettings';
import DcfResults from '@/components/projections/DcfResults';
import { calculateProjections, ProjectionInputs } from '@/utils/calculateProjections';
import { calculateDcf } from '@/utils/calculateDcf';

// Define the structure for cost components
export interface CostComponent {
  id: number;
  name: string;
  value: number;
  currency: 'USD' | 'PEN';
}

const ProjectionsPage = () => {
  // State for all projection inputs, managed at the page level
  const [inputs, setInputs] = useState({
    startUnits: 10,
    growthRate: 10,
    unitPrice: 549,
    unitPriceCurrency: 'PEN' as 'USD' | 'PEN',
    timeFrame: 12,
  });

  const [exchangeRate, setExchangeRate] =useState(3.65);
  const [outputCurrency, setOutputCurrency] = useState<'USD' | 'PEN'>('PEN');

  // Advanced Settings
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [discountRate, setDiscountRate] = useState(12);
  const [taxRate, setTaxRate] = useState(29.5);
  const [applyTax, setApplyTax] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [costComponents, setCostComponents] = useState<CostComponent[]>([
    { id: 1, name: 'Production', value: 54, currency: 'USD' },
    { id: 2, name: 'Shipping', value: 3.5, currency: 'USD' },
    { id: 3, name: 'Marketing', value: 2.5, currency: 'USD' },
  ]);
  const [isCostBreakdownOpen, setIsCostBreakdownOpen] = useState(false);

  const initialUnitCost = useMemo(() => {
    return costComponents.reduce((total, component) => {
        // A simple assumption that initial costs are USD if not specified otherwise
        const valueInPen = component.currency === 'USD' ? component.value * exchangeRate : component.value;
        return total + valueInPen;
    }, 0) / exchangeRate;
  }, [costComponents, exchangeRate]);

  const [manualUnitCost, setManualUnitCost] = useState({
      value: initialUnitCost,
      currency: 'USD' as 'USD' | 'PEN'
  });

  const normalizeToPen = useCallback((value: number, currency: 'USD' | 'PEN') => {
      return currency === 'USD' ? value * exchangeRate : value;
  }, [exchangeRate])

  const unitPriceInPen = useMemo(() => {
    return normalizeToPen(inputs.unitPrice, inputs.unitPriceCurrency);
  }, [inputs.unitPrice, inputs.unitPriceCurrency, normalizeToPen]);

  const unitCostInPen = useMemo(() => {
    if (isCostBreakdownOpen) {
      return costComponents.reduce((total, component) => {
        return total + normalizeToPen(component.value, component.currency);
      }, 0);
    }
    return normalizeToPen(manualUnitCost.value, manualUnitCost.currency);
  }, [isCostBreakdownOpen, costComponents, manualUnitCost, normalizeToPen]);


  // Memoize the projection calculation
  const projectionData = useMemo(() => {
    const fullInputs: ProjectionInputs = {
        ...inputs,
        unitPrice: unitPriceInPen,
        unitCost: unitCostInPen
    };
    return calculateProjections(fullInputs);
  }, [inputs, unitPriceInPen, unitCostInPen]);

  const dcfData = useMemo(() => {
    return calculateDcf({
      projectionData,
      discountRate,
      taxRate,
      applyTax,
    });
  }, [projectionData, discountRate, taxRate, applyTax]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-6 lg:p-8">
      <header className="flex items-center mb-8">
        <Image src="/Assets/Soma_Logo.png" alt="Soma Logo" width={40} height={40} />
        <h1 className="ml-3 text-2xl sm:text-3xl font-bold">Projections</h1>
      </header>
      <main className="space-y-8">
        <InputPanel
          inputs={inputs}
          setInputs={setInputs}
          costComponents={costComponents}
          setCostComponents={setCostComponents}
          isCostBreakdownOpen={isCostBreakdownOpen}
          setIsCostBreakdownOpen={setIsCostBreakdownOpen}
          manualUnitCost={manualUnitCost}
          setManualUnitCost={setManualUnitCost}
          exchangeRate={exchangeRate}
          setExchangeRate={setExchangeRate}
        />
        <div className="flex justify-start items-center space-x-4">
            <span className="font-medium text-gray-300">Display Currency:</span>
            <div className="flex rounded-lg shadow-sm bg-gray-800 border border-gray-700">
                <button className={`px-4 py-2 text-sm font-bold rounded-l-lg transition-colors ${outputCurrency === 'PEN' ? 'bg-soma-aquamarina text-soma-petroleo' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`} onClick={() => setOutputCurrency('PEN')}>PEN (S/.)</button>
                <button className={`px-4 py-2 text-sm font-bold rounded-r-lg transition-colors ${outputCurrency === 'USD' ? 'bg-soma-aquamarina text-soma-petroleo' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`} onClick={() => setOutputCurrency('USD')}>USD ($)</button>
            </div>
        </div>
        <StatCards data={projectionData} outputCurrency={outputCurrency} exchangeRate={exchangeRate} />
        <ProjectionChart data={projectionData} outputCurrency={outputCurrency} exchangeRate={exchangeRate} />

        <AdvancedSettings
            isAdvancedOpen={isAdvancedOpen}
            setIsAdvancedOpen={setIsAdvancedOpen}
            discountRate={discountRate}
            setDiscountRate={setDiscountRate}
            taxRate={taxRate}
            setTaxRate={setTaxRate}
            applyTax={applyTax}
            setApplyTax={setApplyTax}
        />

        {isAdvancedOpen && (
            <DcfResults
                dcfData={dcfData}
                outputCurrency={outputCurrency}
                exchangeRate={exchangeRate}
                applyTax={applyTax}
                discountRate={discountRate}
                inputs={inputs}
                unitCostInPen={unitCostInPen}
            />
        )}
      </main>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#2FFFCC] text-white p-3 rounded-full shadow-lg hover:bg-opacity-90 transition-all z-50 focus:outline-none focus:ring-2 focus:ring-[#2FFFCC] focus:ring-opacity-50"
          aria-label="Back to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default ProjectionsPage; 