"use client";

import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  Calculator,
  X,
  Plus
} from 'lucide-react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface CostItem {
  category: string;
  usd: number;
  pen?: number;
  notes?: string;
}

interface RecurringExpense {
  service: string;
  monthlyCostUSD: number;
}

interface DynamicCost {
  id: string;
  name: string;
  category: string; // Changed to string to allow custom categories
  currency: 'USD' | 'PEN';
  type: 'percentage' | 'numerical' | 'each';
  value: number;
  enabled: boolean;
}

interface FinancialInputs {
  unitsOrdered: number;
  unitsSold: number;
  unitPricePEN: number;
  exchangeRate: number;
  igvEnabled: boolean;
  igvRate: number;
  
  // Custom Exchange Rates
  customExchangeRatesEnabled: boolean;
  
  // COGS
  cogsEnabled: boolean;
  cogsAmount: number;
  cogsCurrency: 'USD' | 'PEN';
  cogsCustomExchangeRate: number;
  
  // Sales Costs
  salesCostsEnabled: boolean;
  mercadoPagoEnabled: boolean;
  mercadoPagoFee: number;
  shopifyFeeEnabled: boolean;
  shopifyFee: number;
  shopifyTransactionEnabled: boolean;
  shopifyTransactionFee: number;
  shopifyTransactionCurrency: 'USD' | 'PEN';
  
  // Shipping Costs
  shippingEnabled: boolean;
  impuestosEnabled: boolean;
  impuestosAmount: number;
  impuestosCurrency: 'USD' | 'PEN';
  impuestosCustomExchangeRate: number;
  dhlArancelesEnabled: boolean;
  dhlArancelesAmount: number;
  dhlArancelesCurrency: 'USD' | 'PEN';
  dhlArancelesCustomExchangeRate: number;
  dhlNacionalizacionEnabled: boolean;
  dhlNacionalizacionAmount: number;
  dhlNacionalizacionCurrency: 'USD' | 'PEN';
  dhlNacionalizacionCustomExchangeRate: number;
  
  // Packaging Costs
  packagingEnabled: boolean;
  paquetesEnabled: boolean;
  paquetesAmount: number;
  paquetesCurrency: 'USD' | 'PEN';
  paquetesCustomExchangeRate: number;
  stickersEnabled: boolean;
  stickersAmount: number;
  stickersCurrency: 'USD' | 'PEN';
  stickersCustomExchangeRate: number;
  
  // Delivery Costs
  deliveryEnabled: boolean;
  deliveryPerUnit: number;
  deliveryCurrency: 'USD' | 'PEN';
  deliveryCustomExchangeRate: number;
  
  // Recurring Costs
  recurringEnabled: boolean;
  appleDevEnabled: boolean;
  appleDevAmount: number;
  appleDevCurrency: 'USD' | 'PEN';
  appleDevCustomExchangeRate: number;
  googleWorkspaceEnabled: boolean;
  googleWorkspaceAmount: number;
  googleWorkspaceCurrency: 'USD' | 'PEN';
  googleWorkspaceCustomExchangeRate: number;
  shopifyRecurringEnabled: boolean;
  shopifyRecurringAmount: number;
  shopifyRecurringCurrency: 'USD' | 'PEN';
  shopifyRecurringCustomExchangeRate: number;
  contabilidadEnabled: boolean;
  contabilidadAmount: number;
  contabilidadCurrency: 'USD' | 'PEN';
  contabilidadCustomExchangeRate: number;
  firebaseEnabled: boolean;
  firebaseAmount: number;
  firebaseCurrency: 'USD' | 'PEN';
  firebaseCustomExchangeRate: number;
}

const FinancialsPage = () => {
  // Core inputs
  const [inputs, setInputs] = useState<FinancialInputs>({
    unitsOrdered: 100,
    unitsSold: 80,
    unitPricePEN: 549,
    exchangeRate: 3.6,
    igvEnabled: true,
    igvRate: 18,
    
    // Custom Exchange Rates
    customExchangeRatesEnabled: false,
    
    // COGS
    cogsEnabled: true,
    cogsAmount: 5822.32,
    cogsCurrency: 'USD',
    cogsCustomExchangeRate: 3.6,
    
    // Sales Costs
    salesCostsEnabled: true,
    mercadoPagoEnabled: true,
    mercadoPagoFee: 3.6,
    shopifyFeeEnabled: true,
    shopifyFee: 2.2,
    shopifyTransactionEnabled: true,
    shopifyTransactionFee: 3.1,
    shopifyTransactionCurrency: 'USD',
    
    // Shipping Costs
    shippingEnabled: true,
    impuestosEnabled: true,
    impuestosAmount: 1769,
    impuestosCurrency: 'PEN',
    impuestosCustomExchangeRate: 3.6,
    dhlArancelesEnabled: true,
    dhlArancelesAmount: 85.58,
    dhlArancelesCurrency: 'PEN',
    dhlArancelesCustomExchangeRate: 3.6,
    dhlNacionalizacionEnabled: true,
    dhlNacionalizacionAmount: 37.44,
    dhlNacionalizacionCurrency: 'PEN',
    dhlNacionalizacionCustomExchangeRate: 3.6,
    
    // Packaging Costs
    packagingEnabled: true,
    paquetesEnabled: true,
    paquetesAmount: 1475,
    paquetesCurrency: 'PEN',
    paquetesCustomExchangeRate: 3.6,
    stickersEnabled: true,
    stickersAmount: 250,
    stickersCurrency: 'PEN',
    stickersCustomExchangeRate: 3.6,
    
    // Delivery Costs
    deliveryEnabled: true,
    deliveryPerUnit: 13,
    deliveryCurrency: 'PEN',
    deliveryCustomExchangeRate: 3.6,
    
    // Recurring Costs
    recurringEnabled: true,
    appleDevEnabled: true,
    appleDevAmount: 8.25,
    appleDevCurrency: 'USD',
    appleDevCustomExchangeRate: 3.6,
    googleWorkspaceEnabled: true,
    googleWorkspaceAmount: 29.90,
    googleWorkspaceCurrency: 'USD',
    googleWorkspaceCustomExchangeRate: 3.6,
    shopifyRecurringEnabled: true,
    shopifyRecurringAmount: 25.00,
    shopifyRecurringCurrency: 'USD',
    shopifyRecurringCustomExchangeRate: 3.6,
    contabilidadEnabled: true,
    contabilidadAmount: 97.77,
    contabilidadCurrency: 'USD',
    contabilidadCustomExchangeRate: 3.6,
    firebaseEnabled: true,
    firebaseAmount: 10,
    firebaseCurrency: 'USD',
    firebaseCustomExchangeRate: 3.6
  });

  // UI state
  const [costParametersOpen, setCostParametersOpen] = useState(false);
  
  // Dynamic costs state
  const [dynamicCosts, setDynamicCosts] = useState<DynamicCost[]>([]);
  const [newCostName, setNewCostName] = useState('');
  const [newCostCategory, setNewCostCategory] = useState<string>('Sales Cost');
  const [newCostCurrency, setNewCostCurrency] = useState<'USD' | 'PEN'>('USD');
  const [newCostType, setNewCostType] = useState<'percentage' | 'numerical' | 'each'>('numerical');
  const [newCostValue, setNewCostValue] = useState<number>(0);
  
  // Custom categories state
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddCostDropdown, setShowAddCostDropdown] = useState(false);

  // Hardcoded cost breakdown data
  const costBreakdown: CostItem[] = useMemo(() => [
    { category: 'Product cost (FOB)', usd: 5822.32, notes: 'Import base cost' },
    { category: 'Import taxes (SUNAT)', usd: 501.13, pen: 1769 },
    { category: 'DHL Tariffs + Nationalization', usd: 34.85, pen: 123.02, notes: 'Combined' },
    { category: 'Packaging - Boxes', usd: 417.85, pen: 1475 },
    { category: 'Packaging - Stickers', usd: 70.82, pen: 250 },
    { category: 'Sizing Kits (100 units)', usd: 400.00 },
    { category: 'Shipping (100 shipments)', usd: 368.27, pen: 1300 }
  ], []);

  // Recurring monthly expenses
  const recurringExpenses: RecurringExpense[] = [
    { service: 'Apple Dev Program', monthlyCostUSD: 8.25 },
    { service: 'Google Workspace', monthlyCostUSD: 29.90 },
    { service: 'Shopify', monthlyCostUSD: 25.00 },
    { service: 'Accounting', monthlyCostUSD: 97.77 },
    { service: 'Firebase (Cloud)', monthlyCostUSD: 10.00 }
  ];

  // Financial calculations
  const financialSummary = useMemo(() => {
    const { 
      unitsSold, unitPricePEN, exchangeRate, igvEnabled, igvRate,
      customExchangeRatesEnabled,
      cogsEnabled, cogsAmount, cogsCurrency, cogsCustomExchangeRate,
      salesCostsEnabled, mercadoPagoEnabled, mercadoPagoFee, shopifyFeeEnabled, shopifyFee, shopifyTransactionEnabled, shopifyTransactionFee, shopifyTransactionCurrency,
      shippingEnabled, impuestosEnabled, impuestosAmount, impuestosCurrency, impuestosCustomExchangeRate, dhlArancelesEnabled, dhlArancelesAmount, dhlArancelesCurrency, dhlArancelesCustomExchangeRate, dhlNacionalizacionEnabled, dhlNacionalizacionAmount, dhlNacionalizacionCurrency, dhlNacionalizacionCustomExchangeRate,
      packagingEnabled, paquetesEnabled, paquetesAmount, paquetesCurrency, stickersEnabled, stickersAmount, stickersCurrency,
      deliveryEnabled, deliveryPerUnit, deliveryCurrency,
      recurringEnabled, appleDevEnabled, appleDevAmount, appleDevCurrency, appleDevCustomExchangeRate, googleWorkspaceEnabled, googleWorkspaceAmount, googleWorkspaceCurrency, googleWorkspaceCustomExchangeRate, shopifyRecurringEnabled, shopifyRecurringAmount, shopifyRecurringCurrency, shopifyRecurringCustomExchangeRate, contabilidadEnabled, contabilidadAmount, contabilidadCurrency, contabilidadCustomExchangeRate, firebaseEnabled, firebaseAmount, firebaseCurrency, firebaseCustomExchangeRate
    } = inputs;
    
    // Revenue calculations
    const grossRevenuePEN = unitsSold * unitPricePEN;
    const grossRevenueUSD = grossRevenuePEN / exchangeRate;
    
    // COGS calculation (Cost of Goods Sold)
    let cogsUSD = 0;
    let cogsPEN = 0;
    if (cogsEnabled) {
      const currentExchangeRate = customExchangeRatesEnabled ? cogsCustomExchangeRate : exchangeRate;
      if (cogsCurrency === 'USD') {
        cogsUSD = cogsAmount;
        cogsPEN = cogsAmount * currentExchangeRate;
      } else {
        cogsPEN = cogsAmount;
        cogsUSD = cogsAmount / currentExchangeRate;
      }
    }
    
    // Legacy total cost calculation for backwards compatibility
    const totalCostUSD = costBreakdown.reduce((sum, item) => sum + item.usd, 0);
    const totalCostPEN = totalCostUSD * exchangeRate;
    const unitCostUSD = totalCostUSD / 100; // Assuming 100 units per batch
    
    // Gross Margin
    const grossMarginUSD = grossRevenueUSD - cogsUSD;
    const grossMarginPEN = grossMarginUSD * exchangeRate;
    
    // Individual cost categories with toggles
    let shippingCostsUSD = 0;
    let shippingCostsPEN = 0;
    if (shippingEnabled) {
      if (impuestosEnabled) {
        const currentExchangeRate = customExchangeRatesEnabled ? impuestosCustomExchangeRate : exchangeRate;
        if (impuestosCurrency === 'PEN') {
          shippingCostsPEN += impuestosAmount;
          shippingCostsUSD += impuestosAmount / currentExchangeRate;
        } else {
          shippingCostsUSD += impuestosAmount;
          shippingCostsPEN += impuestosAmount * currentExchangeRate;
        }
      }
      if (dhlArancelesEnabled) {
        const currentExchangeRate = customExchangeRatesEnabled ? dhlArancelesCustomExchangeRate : exchangeRate;
        if (dhlArancelesCurrency === 'PEN') {
          shippingCostsPEN += dhlArancelesAmount;
          shippingCostsUSD += dhlArancelesAmount / currentExchangeRate;
        } else {
          shippingCostsUSD += dhlArancelesAmount;
          shippingCostsPEN += dhlArancelesAmount * currentExchangeRate;
        }
      }
      if (dhlNacionalizacionEnabled) {
        const currentExchangeRate = customExchangeRatesEnabled ? dhlNacionalizacionCustomExchangeRate : exchangeRate;
        if (dhlNacionalizacionCurrency === 'PEN') {
          shippingCostsPEN += dhlNacionalizacionAmount;
          shippingCostsUSD += dhlNacionalizacionAmount / currentExchangeRate;
        } else {
          shippingCostsUSD += dhlNacionalizacionAmount;
          shippingCostsPEN += dhlNacionalizacionAmount * currentExchangeRate;
        }
      }
    }
    
    let packagingCostsUSD = 0;
    let packagingCostsPEN = 0;
    if (packagingEnabled) {
      if (paquetesEnabled) {
        const currentExchangeRate = customExchangeRatesEnabled ? inputs.paquetesCustomExchangeRate : exchangeRate;
        if (paquetesCurrency === 'PEN') {
          packagingCostsPEN += paquetesAmount;
          packagingCostsUSD += paquetesAmount / currentExchangeRate;
        } else {
          packagingCostsUSD += paquetesAmount;
          packagingCostsPEN += paquetesAmount * currentExchangeRate;
        }
      }
      if (stickersEnabled) {
        const currentExchangeRate = customExchangeRatesEnabled ? inputs.stickersCustomExchangeRate : exchangeRate;
        if (stickersCurrency === 'PEN') {
          packagingCostsPEN += stickersAmount;
          packagingCostsUSD += stickersAmount / currentExchangeRate;
        } else {
          packagingCostsUSD += stickersAmount;
          packagingCostsPEN += stickersAmount * currentExchangeRate;
        }
      }
    }
    
    let deliveryCostsUSD = 0;
    let deliveryCostsPEN = 0;
    if (deliveryEnabled) {
      const currentExchangeRate = customExchangeRatesEnabled ? inputs.deliveryCustomExchangeRate : exchangeRate;
      if (deliveryCurrency === 'PEN') {
        deliveryCostsPEN = unitsSold * deliveryPerUnit;
        deliveryCostsUSD = deliveryCostsPEN / currentExchangeRate;
      } else {
        deliveryCostsUSD = unitsSold * deliveryPerUnit;
        deliveryCostsPEN = deliveryCostsUSD * currentExchangeRate;
      }
    }
    
    let recurringMonthlyUSD = 0;
    let recurringMonthlyPEN = 0;
    if (recurringEnabled) {
      if (appleDevEnabled) {
        const currentExchangeRate = customExchangeRatesEnabled ? appleDevCustomExchangeRate : exchangeRate;
        if (appleDevCurrency === 'USD') {
          recurringMonthlyUSD += appleDevAmount;
          recurringMonthlyPEN += appleDevAmount * currentExchangeRate;
        } else {
          recurringMonthlyPEN += appleDevAmount;
          recurringMonthlyUSD += appleDevAmount / currentExchangeRate;
        }
      }
      if (googleWorkspaceEnabled) {
        const currentExchangeRate = customExchangeRatesEnabled ? googleWorkspaceCustomExchangeRate : exchangeRate;
        if (googleWorkspaceCurrency === 'USD') {
          recurringMonthlyUSD += googleWorkspaceAmount;
          recurringMonthlyPEN += googleWorkspaceAmount * currentExchangeRate;
        } else {
          recurringMonthlyPEN += googleWorkspaceAmount;
          recurringMonthlyUSD += googleWorkspaceAmount / currentExchangeRate;
        }
      }
      if (shopifyRecurringEnabled) {
        const currentExchangeRate = customExchangeRatesEnabled ? shopifyRecurringCustomExchangeRate : exchangeRate;
        if (shopifyRecurringCurrency === 'USD') {
          recurringMonthlyUSD += shopifyRecurringAmount;
          recurringMonthlyPEN += shopifyRecurringAmount * currentExchangeRate;
        } else {
          recurringMonthlyPEN += shopifyRecurringAmount;
          recurringMonthlyUSD += shopifyRecurringAmount / currentExchangeRate;
        }
      }
      if (contabilidadEnabled) {
        const currentExchangeRate = customExchangeRatesEnabled ? contabilidadCustomExchangeRate : exchangeRate;
        if (contabilidadCurrency === 'USD') {
          recurringMonthlyUSD += contabilidadAmount;
          recurringMonthlyPEN += contabilidadAmount * currentExchangeRate;
        } else {
          recurringMonthlyPEN += contabilidadAmount;
          recurringMonthlyUSD += contabilidadAmount / currentExchangeRate;
        }
      }
      if (firebaseEnabled) {
        const currentExchangeRate = customExchangeRatesEnabled ? firebaseCustomExchangeRate : exchangeRate;
        if (firebaseCurrency === 'USD') {
          recurringMonthlyUSD += firebaseAmount;
          recurringMonthlyPEN += firebaseAmount * currentExchangeRate;
        } else {
          recurringMonthlyPEN += firebaseAmount;
          recurringMonthlyUSD += firebaseAmount / currentExchangeRate;
        }
      }
    }
    
    // Sale costs (fees) with toggles
    let totalSaleCostsUSD = 0;
    let totalSaleCostsPEN = 0;
    let mercadoPagoCommissionUSD = 0;
    let mercadoPagoCommissionPEN = 0;
    let shopifyFeeUSD = 0;
    let shopifyFeePEN = 0;
    let shopifyTransactionFeeTotalUSD = 0;
    let shopifyTransactionFeeTotalPEN = 0;
    
    if (salesCostsEnabled) {
      if (mercadoPagoEnabled) {
        mercadoPagoCommissionPEN = (grossRevenuePEN * mercadoPagoFee) / 100;
        mercadoPagoCommissionUSD = mercadoPagoCommissionPEN / exchangeRate;
        totalSaleCostsUSD += mercadoPagoCommissionUSD;
        totalSaleCostsPEN += mercadoPagoCommissionPEN;
      }
      
      if (shopifyFeeEnabled) {
        shopifyFeePEN = (grossRevenuePEN * shopifyFee) / 100;
        shopifyFeeUSD = shopifyFeePEN / exchangeRate;
        totalSaleCostsUSD += shopifyFeeUSD;
        totalSaleCostsPEN += shopifyFeePEN;
      }
      
      if (shopifyTransactionEnabled) {
        if (shopifyTransactionCurrency === 'USD') {
        shopifyTransactionFeeTotalUSD = unitsSold * shopifyTransactionFee;
        shopifyTransactionFeeTotalPEN = shopifyTransactionFeeTotalUSD * exchangeRate;
        } else {
          shopifyTransactionFeeTotalPEN = unitsSold * shopifyTransactionFee;
          shopifyTransactionFeeTotalUSD = shopifyTransactionFeeTotalPEN / exchangeRate;
        }
        totalSaleCostsUSD += shopifyTransactionFeeTotalUSD;
        totalSaleCostsPEN += shopifyTransactionFeeTotalPEN;
      }
    }
    
    // Dynamic costs calculation
    let dynamicCostsUSD = 0;
    let dynamicCostsPEN = 0;
    
    dynamicCosts.forEach(cost => {
      if (!cost.enabled) return;
      
      let costValueUSD = 0;
      let costValuePEN = 0;
      
      if (cost.type === 'percentage') {
        // Apply percentage to gross revenue
        if (cost.currency === 'USD') {
          costValueUSD = (grossRevenueUSD * cost.value) / 100;
          costValuePEN = costValueUSD * exchangeRate;
        } else {
          costValuePEN = (grossRevenuePEN * cost.value) / 100;
          costValueUSD = costValuePEN / exchangeRate;
        }
      } else if (cost.type === 'each') {
        // Apply cost per unit sold
        if (cost.currency === 'USD') {
          costValueUSD = cost.value * unitsSold;
          costValuePEN = costValueUSD * exchangeRate;
        } else {
          costValuePEN = cost.value * unitsSold;
          costValueUSD = costValuePEN / exchangeRate;
        }
      } else {
        // Numerical value
        if (cost.currency === 'USD') {
          costValueUSD = cost.value;
          costValuePEN = cost.value * exchangeRate;
        } else {
          costValuePEN = cost.value;
          costValueUSD = cost.value / exchangeRate;
        }
      }
      
      dynamicCostsUSD += costValueUSD;
      dynamicCostsPEN += costValuePEN;
    });

    // Operating Expenses (sum of all operating costs)
    const operatingExpensesUSD = shippingCostsUSD + packagingCostsUSD + deliveryCostsUSD + recurringMonthlyUSD + totalSaleCostsUSD + dynamicCostsUSD;
    const operatingExpensesPEN = operatingExpensesUSD * exchangeRate;
    
    // Operating Margin (Gross Margin - Operating Expenses)
    const operatingMarginUSD = grossMarginUSD - operatingExpensesUSD;
    const operatingMarginPEN = operatingMarginUSD * exchangeRate;
    
    // Tax calculations (applied to Operating Margin)
    const igvCollected = igvEnabled ? (operatingMarginUSD * igvRate) / 100 : 0;
    const igvCollectedPEN = igvCollected * exchangeRate;
    
    // Net Profit
    const netProfitUSD = operatingMarginUSD - igvCollected;
    const netProfitPEN = netProfitUSD * exchangeRate;
    
    // Break-even calculation (simplified and accurate approach)
    const sellingPricePerUnit = grossRevenueUSD / unitsSold;
    const variableCostPerUnit = cogsUSD / inputs.unitsOrdered; // COGS per unit is the main variable cost
    
    // Fixed costs = All operating expenses + taxes
    const fixedCostsUSD = operatingExpensesUSD + igvCollected;
    
    // Break-even formula: Fixed Costs / (Selling Price per Unit - Variable Cost per Unit)
    const contributionMarginPerUnit = sellingPricePerUnit - variableCostPerUnit;
    const breakEvenUnits = contributionMarginPerUnit > 0 ? Math.ceil(fixedCostsUSD / contributionMarginPerUnit) : 0;
    
    // Additional values for display
    const revenuePerUnitUSD = sellingPricePerUnit;
    const variableCostsPerUnitUSD = variableCostPerUnit;
    
    return {
      grossRevenuePEN,
      grossRevenueUSD,
      cogsUSD,
      cogsPEN,
      grossMarginUSD,
      grossMarginPEN,
      shippingCostsUSD,
      shippingCostsPEN,
      packagingCostsUSD,
      packagingCostsPEN,
      deliveryCostsUSD,
      deliveryCostsPEN,
      recurringMonthlyUSD,
      recurringMonthlyPEN,
      mercadoPagoCommissionPEN,
      mercadoPagoCommissionUSD,
      shopifyFeePEN,
      shopifyFeeUSD,
      shopifyTransactionFeeTotalPEN,
      shopifyTransactionFeeTotalUSD,
      totalSaleCostsUSD,
      totalSaleCostsPEN,
      dynamicCostsUSD,
      dynamicCostsPEN,
      operatingExpensesUSD,
      operatingExpensesPEN,
      operatingMarginUSD,
      operatingMarginPEN,
      igvCollected,
      igvCollectedPEN,
      netProfitUSD,
      netProfitPEN,
      breakEvenUnits,
      contributionMarginPerUnit,
      variableCostsPerUnitUSD,
      revenuePerUnitUSD,
      sellingPricePerUnit,
      variableCostPerUnit,
      fixedCostsUSD,
      totalCostUSD,
      totalCostPEN,
      unitCostUSD
    };
  }, [inputs, costBreakdown, dynamicCosts]);

  // Format currency
  const formatCurrency = useCallback((value: number, currency: 'USD' | 'PEN' = 'USD') => {
    const symbol = currency === 'USD' ? '$' : 'S/.';
    return `${symbol}${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, []);

  // Format percentage
  const formatPercentage = useCallback((value: number, total: number) => {
    const percentage = total !== 0 ? (value / total) * 100 : 0;
    return `${percentage.toFixed(1)}%`;
  }, []);



  // Create individual currency toggle component
  const CurrencyToggle = ({ currency, setCurrency }: { currency: 'USD' | 'PEN', setCurrency: (currency: 'USD' | 'PEN') => void }) => (
    <div className="flex items-center text-xs rounded-md border border-gray-600 ml-2">
      <button 
        onClick={() => setCurrency('PEN')} 
        className={`px-2 py-1 rounded-l-md transition-colors ${currency === 'PEN' ? 'bg-[#2FFFCC] text-gray-900 font-bold' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
      >
        PEN
      </button>
      <button 
        onClick={() => setCurrency('USD')} 
        className={`px-2 py-1 rounded-r-md transition-colors ${currency === 'USD' ? 'bg-[#2FFFCC] text-gray-900 font-bold' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
      >
        USD
      </button>
    </div>
  );

  // Generate cascade/waterfall chart data
  const cascadeData = useMemo(() => {
    const { grossRevenueUSD, cogsUSD, shippingCostsUSD, packagingCostsUSD, deliveryCostsUSD, recurringMonthlyUSD, totalSaleCostsUSD, dynamicCostsUSD, igvCollected, netProfitUSD } = financialSummary;
    
    let cumulative = 0;
    const data = [
      { 
        name: 'Gross Revenue', 
        value: grossRevenueUSD, 
        start: 0, 
        end: grossRevenueUSD,
        type: 'positive'
      }
    ];
    
    cumulative = grossRevenueUSD;
    
    // Add each cost as a negative waterfall step
    const costs = [
      { name: 'COGS', amount: cogsUSD },
      { name: 'Shipping', amount: shippingCostsUSD },
      { name: 'Packaging', amount: packagingCostsUSD },
      { name: 'Delivery', amount: deliveryCostsUSD },
      { name: 'Recurring', amount: recurringMonthlyUSD },
      { name: 'Sales Costs', amount: totalSaleCostsUSD },
      { name: 'Dynamic Costs', amount: dynamicCostsUSD },
      { name: 'Tax (IGV)', amount: igvCollected }
    ];
    
    costs.forEach(cost => {
      if (cost.amount > 0) {
        const start = cumulative - cost.amount;
        data.push({
          name: cost.name,
          value: cost.amount,
          start: start,
          end: cumulative,
          type: 'negative'
        });
        cumulative -= cost.amount;
      }
    });
    
    // Add net profit as final bar
    data.push({
      name: 'Net Profit',
      value: netProfitUSD,
      start: 0,
      end: netProfitUSD,
      type: netProfitUSD >= 0 ? 'positive' : 'negative'
    });
    
    return data;
  }, [financialSummary]);



  const handleInputChange = (field: keyof FinancialInputs, value: number | boolean | string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Helper function to calculate per-unit costs
  const calculatePerUnitCost = (amount: number, currency: 'USD' | 'PEN', customExchangeRate?: number) => {
    if (inputs.unitsOrdered === 0) return { usd: 0, pen: 0 };
    
    const exchangeRateToUse = inputs.customExchangeRatesEnabled && customExchangeRate ? customExchangeRate : inputs.exchangeRate;
    const perUnit = amount / inputs.unitsOrdered;
    
    if (currency === 'USD') {
      return {
        usd: perUnit,
        pen: perUnit * exchangeRateToUse
      };
    } else {
      return {
        usd: perUnit / exchangeRateToUse,
        pen: perUnit
      };
    }
  };

  // Dynamic cost management functions
  const addDynamicCost = () => {
    if (newCostName.trim() === '') return;
    
    const newCost: DynamicCost = {
      id: Date.now().toString(),
      name: newCostName.trim(),
      category: newCostCategory,
      currency: newCostCurrency,
      type: newCostType,
      value: newCostValue,
      enabled: true
    };
    
    setDynamicCosts(prev => [...prev, newCost]);
    
    // Reset form and close dropdown
    setNewCostName('');
    setNewCostValue(0);
    setShowAddCostDropdown(false);
  };

  const removeDynamicCost = (id: string) => {
    setDynamicCosts(prev => prev.filter(cost => cost.id !== id));
  };

  const updateDynamicCost = (id: string, updates: Partial<DynamicCost>) => {
    setDynamicCosts(prev => 
      prev.map(cost => 
        cost.id === id ? { ...cost, ...updates } : cost
      )
    );
  };

  // Custom category management
  const addCustomCategory = () => {
    if (newCategoryName.trim() === '' || customCategories.includes(newCategoryName.trim())) return;
    
    const newCategory = newCategoryName.trim();
    setCustomCategories(prev => [...prev, newCategory]);
    setNewCostCategory(newCategory);
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  // Get all available categories
  const allCategories = [
    'Sales Cost',
    'Shipping Cost', 
    'Tax',
    'Packaging Cost',
    'Delivery Cost',
    'Recurring Expenses',
    ...customCategories
  ];

  // Handle category change including custom category creation
  const handleCategoryChange = (value: string) => {
    if (value === '__ADD_CUSTOM__') {
      setShowAddCategory(true);
      return;
    }
    setNewCostCategory(value);
    setShowAddCategory(false);
  };





  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-6 lg:p-8">
      <header className="flex items-center mb-8">
        <Image src="/Assets/Soma_Logo.png" alt="Soma Logo" width={40} height={40} />
        <h1 className="ml-3 text-2xl sm:text-3xl font-bold">Financial Dashboard</h1>
      </header>

      <main className="space-y-8">
        {/* User Inputs Section */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-white">Input Parameters</h2>
          
          {/* Core Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-gray-300 font-medium mb-2">Units Ordered</label>
              <input
                type="number"
                value={inputs.unitsOrdered}
                onChange={(e) => handleInputChange('unitsOrdered', parseInt(e.target.value) || 0)}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-3"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 font-medium mb-2">Units Sold</label>
              <input
                type="number"
                value={inputs.unitsSold}
                onChange={(e) => handleInputChange('unitsSold', parseInt(e.target.value) || 0)}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-3"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 font-medium mb-2">Unit Price (PEN)</label>
              <input
                type="number"
                step="0.01"
                value={inputs.unitPricePEN}
                onChange={(e) => handleInputChange('unitPricePEN', parseFloat(e.target.value) || 0)}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-3"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 font-medium mb-2">Exchange Rate (USD to PEN)</label>
              <input
                type="number"
                step="0.01"
                value={inputs.exchangeRate}
                onChange={(e) => handleInputChange('exchangeRate', parseFloat(e.target.value) || 0)}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-3"
              />
            </div>
          </div>

          {/* Collapsible Cost Parameters */}
          <div className="border border-gray-700 rounded-lg">
            <button
              onClick={() => setCostParametersOpen(!costParametersOpen)}
              className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors rounded-lg"
            >
              <span className="text-white font-medium">Cost Parameters</span>
              {costParametersOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {costParametersOpen && (
              <div className="border-t border-gray-700 p-6 space-y-6">
                
                {/* Add New Cost Dropdown */}
                <div className="bg-gray-700/30 rounded-lg border border-gray-600">
                  <button
                    onClick={() => setShowAddCostDropdown(!showAddCostDropdown)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors rounded-lg"
                  >
                    <h3 className="text-white font-medium flex items-center">
                      <Plus className="w-4 h-4 mr-2 text-[#2FFFCC]" />
                      Add New Cost
                    </h3>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showAddCostDropdown ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {showAddCostDropdown && (
                    <div className="border-t border-gray-600 p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-gray-300 font-medium mb-2 text-sm">Name</label>
                    <input
                            type="text"
                            value={newCostName}
                            onChange={(e) => setNewCostName(e.target.value)}
                            placeholder="Cost name..."
                            className="w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-2 text-sm"
                          />
                  </div>
                        
                        <div>
                          <label className="block text-gray-300 font-medium mb-2 text-sm">Category</label>
                          <select
                            value={showAddCategory ? '__ADD_CUSTOM__' : newCostCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-2 text-sm"
                          >
                            {allCategories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                            <option value="__ADD_CUSTOM__">+ Add Custom Category</option>
                          </select>
                          {showAddCategory && (
                            <div className="mt-2 flex space-x-2">
                              <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="New category..."
                                className="flex-1 rounded-md bg-gray-600 border-gray-500 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-xs"
                                onKeyPress={(e) => e.key === 'Enter' && addCustomCategory()}
                              />
                              <button
                                onClick={addCustomCategory}
                                disabled={newCategoryName.trim() === ''}
                                className="px-2 py-1 bg-[#2FFFCC] text-gray-900 font-medium rounded-md hover:bg-[#1EEFBB] disabled:bg-gray-600 disabled:text-gray-400 transition-colors text-xs"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => {
                                  setShowAddCategory(false);
                                  setNewCategoryName('');
                                }}
                                className="px-2 py-1 bg-gray-600 text-gray-300 rounded-md hover:bg-gray-500 transition-colors text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 font-medium mb-2 text-sm">Currency</label>
                          <select
                            value={newCostCurrency}
                            onChange={(e) => setNewCostCurrency(e.target.value as 'USD' | 'PEN')}
                            className="w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-2 text-sm"
                          >
                            <option value="USD">USD</option>
                            <option value="PEN">PEN</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 font-medium mb-2 text-sm">Type</label>
                          <select
                            value={newCostType}
                            onChange={(e) => setNewCostType(e.target.value as 'percentage' | 'numerical' | 'each')}
                            className="w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-2 text-sm"
                          >
                            <option value="numerical">Numerical Value</option>
                            <option value="percentage">Percentage (%)</option>
                            <option value="each">Each (per unit)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="md:col-span-2">
                          <label className="block text-gray-300 font-medium mb-2 text-sm">
                            Value {newCostType === 'percentage' ? '(%)' : newCostType === 'each' ? `(${newCostCurrency} each)` : `(${newCostCurrency})`}
                          </label>
                      <input
                        type="number"
                            step="0.01"
                            value={newCostValue}
                            onChange={(e) => setNewCostValue(parseFloat(e.target.value) || 0)}
                            className="w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-2 text-sm"
                          />
                        </div>
                        <div>
                          <button
                            onClick={addDynamicCost}
                            disabled={newCostName.trim() === ''}
                            className="w-full px-4 py-2 bg-[#2FFFCC] text-gray-900 font-medium rounded-md hover:bg-[#1EEFBB] disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                          >
                            Add Cost
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dynamic Costs List */}
                {dynamicCosts.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-white font-medium">Custom Costs</h3>
                    {dynamicCosts.map((cost) => (
                      <div key={cost.id} className="flex items-center space-x-4 bg-gray-700/20 p-3 rounded-lg">
                    <input
                      type="checkbox"
                          checked={cost.enabled}
                          onChange={(e) => updateDynamicCost(cost.id, { enabled: e.target.checked })}
                      className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                    />
                        <span className="text-gray-300 flex-1">{cost.name}</span>
                        <span className="text-gray-400 text-sm">({cost.category})</span>
                        <span className="text-gray-300 text-sm">
                          {cost.type === 'percentage' 
                            ? `${cost.value}%` 
                            : cost.type === 'each'
                            ? `${cost.value} ${cost.currency} each`
                            : `${cost.value} ${cost.currency}`
                          }
                        </span>
                        <button
                          onClick={() => removeDynamicCost(cost.id)}
                          className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                  </div>
                    ))}
                  </div>
                )}
                
                {/* Custom Exchange Rate Toggle */}
                <div className="space-y-3 border-b border-gray-600 pb-4">
                  <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                      id="customExchangeRates"
                      checked={inputs.customExchangeRatesEnabled}
                      onChange={(e) => handleInputChange('customExchangeRatesEnabled', e.target.checked)}
                          className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                        />
                    <label htmlFor="customExchangeRates" className="text-white font-medium">Add Custom XR to Each Cost</label>
                  </div>
                  {inputs.customExchangeRatesEnabled && (
                    <div className="ml-6">
                      <p className="text-gray-400 text-sm">
                        When enabled, each cost parameter will have its own customizable exchange rate for more accurate calculations.
                      </p>
                    </div>
                  )}
                      </div>
                      
                {/* COGS Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                      id="cogs"
                      checked={inputs.cogsEnabled}
                      onChange={(e) => handleInputChange('cogsEnabled', e.target.checked)}
                          className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                        />
                    <label htmlFor="cogs" className="text-white font-medium">COGS (Cost of Goods Sold)</label>
                  </div>
                  {inputs.cogsEnabled && (
                    <div className="ml-6 space-y-2">
                      <div className="flex items-center space-x-4 flex-wrap">
                        <label className="text-gray-300">Amount</label>
                          <input
                            type="number"
                          step="0.01"
                          value={inputs.cogsAmount}
                          onChange={(e) => handleInputChange('cogsAmount', parseFloat(e.target.value) || 0)}
                          className="w-24 rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-sm"
                        />
                        <CurrencyToggle 
                          currency={inputs.cogsCurrency} 
                          setCurrency={(currency) => handleInputChange('cogsCurrency', currency)} 
                        />
                        {inputs.customExchangeRatesEnabled && (
                          <>
                            <label className="text-gray-400 text-xs">XR:</label>
                          <input
                            type="number"
                            step="0.01"
                              value={inputs.cogsCustomExchangeRate}
                              onChange={(e) => handleInputChange('cogsCustomExchangeRate', parseFloat(e.target.value) || 0)}
                              className="w-16 rounded-md bg-gray-600 border-gray-500 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-xs"
                            />
                          </>
                        )}
                        <span className="text-gray-500 text-xs italic ml-4">
                          {(() => {
                            const perUnit = calculatePerUnitCost(inputs.cogsAmount, inputs.cogsCurrency, inputs.cogsCustomExchangeRate);
                            return `${perUnit.usd.toFixed(2)} USD or ${perUnit.pen.toFixed(2)} PEN per unit`;
                          })()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shipping Costs Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="shipping"
                      checked={inputs.shippingEnabled}
                      onChange={(e) => handleInputChange('shippingEnabled', e.target.checked)}
                      className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                    />
                    <label htmlFor="shipping" className="text-white font-medium">Shipping Costs</label>
                  </div>
                  {inputs.shippingEnabled && (
                    <div className="ml-6 space-y-4">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          id="impuestos"
                          checked={inputs.impuestosEnabled}
                          onChange={(e) => handleInputChange('impuestosEnabled', e.target.checked)}
                          className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                        />
                        <label htmlFor="impuestos" className="text-gray-300">Impuestos</label>
                        {inputs.impuestosEnabled && (
                          <>
                            <input
                              type="number"
                              step="0.01"
                              value={inputs.impuestosAmount}
                              onChange={(e) => handleInputChange('impuestosAmount', parseFloat(e.target.value) || 0)}
                              className="w-24 rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-sm"
                            />
                            <CurrencyToggle 
                              currency={inputs.impuestosCurrency} 
                              setCurrency={(currency) => handleInputChange('impuestosCurrency', currency)} 
                            />
                            {inputs.customExchangeRatesEnabled && (
                              <>
                                <label className="text-gray-400 text-xs">XR:</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={inputs.impuestosCustomExchangeRate}
                                  onChange={(e) => handleInputChange('impuestosCustomExchangeRate', parseFloat(e.target.value) || 0)}
                                  className="w-16 rounded-md bg-gray-600 border-gray-500 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-xs"
                                />
                              </>
                            )}
                            <span className="text-gray-500 text-xs italic ml-4">
                              {(() => {
                                const perUnit = calculatePerUnitCost(inputs.impuestosAmount, inputs.impuestosCurrency, inputs.impuestosCustomExchangeRate);
                                return `${perUnit.usd.toFixed(2)} USD or ${perUnit.pen.toFixed(2)} PEN per unit`;
                              })()}
                            </span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          id="dhlAranceles"
                          checked={inputs.dhlArancelesEnabled}
                          onChange={(e) => handleInputChange('dhlArancelesEnabled', e.target.checked)}
                          className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                        />
                        <label htmlFor="dhlAranceles" className="text-gray-300">DHL Aranceles</label>
                        {inputs.dhlArancelesEnabled && (
                          <>
                            <input
                              type="number"
                              step="0.01"
                              value={inputs.dhlArancelesAmount}
                              onChange={(e) => handleInputChange('dhlArancelesAmount', parseFloat(e.target.value) || 0)}
                              className="w-24 rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-sm"
                            />
                            <CurrencyToggle 
                              currency={inputs.dhlArancelesCurrency} 
                              setCurrency={(currency) => handleInputChange('dhlArancelesCurrency', currency)} 
                            />
                            {inputs.customExchangeRatesEnabled && (
                              <>
                                <label className="text-gray-400 text-xs">XR:</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={inputs.dhlArancelesCustomExchangeRate}
                                  onChange={(e) => handleInputChange('dhlArancelesCustomExchangeRate', parseFloat(e.target.value) || 0)}
                                  className="w-16 rounded-md bg-gray-600 border-gray-500 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-xs"
                                />
                              </>
                            )}
                            <span className="text-gray-500 text-xs italic ml-4">
                              {(() => {
                                const perUnit = calculatePerUnitCost(inputs.dhlArancelesAmount, inputs.dhlArancelesCurrency, inputs.dhlArancelesCustomExchangeRate);
                                return `${perUnit.usd.toFixed(2)} USD or ${perUnit.pen.toFixed(2)} PEN per unit`;
                              })()}
                            </span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          id="dhlNacionalizacion"
                          checked={inputs.dhlNacionalizacionEnabled}
                          onChange={(e) => handleInputChange('dhlNacionalizacionEnabled', e.target.checked)}
                          className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                        />
                        <label htmlFor="dhlNacionalizacion" className="text-gray-300">DHL Nacionalización</label>
                        {inputs.dhlNacionalizacionEnabled && (
                          <>
                            <input
                              type="number"
                              step="0.01"
                              value={inputs.dhlNacionalizacionAmount}
                              onChange={(e) => handleInputChange('dhlNacionalizacionAmount', parseFloat(e.target.value) || 0)}
                              className="w-24 rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-sm"
                            />
                            <CurrencyToggle 
                              currency={inputs.dhlNacionalizacionCurrency} 
                              setCurrency={(currency) => handleInputChange('dhlNacionalizacionCurrency', currency)} 
                            />
                            {inputs.customExchangeRatesEnabled && (
                              <>
                                <label className="text-gray-400 text-xs">XR:</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={inputs.dhlNacionalizacionCustomExchangeRate}
                                  onChange={(e) => handleInputChange('dhlNacionalizacionCustomExchangeRate', parseFloat(e.target.value) || 0)}
                                  className="w-16 rounded-md bg-gray-600 border-gray-500 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-xs"
                                />
                              </>
                            )}
                            <span className="text-gray-500 text-xs italic ml-4">
                              {(() => {
                                const perUnit = calculatePerUnitCost(inputs.dhlNacionalizacionAmount, inputs.dhlNacionalizacionCurrency, inputs.dhlNacionalizacionCustomExchangeRate);
                                return `${perUnit.usd.toFixed(2)} USD or ${perUnit.pen.toFixed(2)} PEN per unit`;
                              })()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sales Costs Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="salesCosts"
                      checked={inputs.salesCostsEnabled}
                      onChange={(e) => handleInputChange('salesCostsEnabled', e.target.checked)}
                      className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                    />
                    <label htmlFor="salesCosts" className="text-white font-medium">Sales Costs</label>
                  </div>
                  {inputs.salesCostsEnabled && (
                    <div className="ml-6 space-y-4">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          id="mercadoPago"
                          checked={inputs.mercadoPagoEnabled}
                          onChange={(e) => handleInputChange('mercadoPagoEnabled', e.target.checked)}
                          className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                        />
                        <label htmlFor="mercadoPago" className="text-gray-300">Mercado Pago Fee</label>
                        {inputs.mercadoPagoEnabled && (
                          <input
                            type="number"
                            step="0.1"
                            value={inputs.mercadoPagoFee}
                            onChange={(e) => handleInputChange('mercadoPagoFee', parseFloat(e.target.value) || 0)}
                            className="w-20 rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-sm"
                          />
                        )}
                        {inputs.mercadoPagoEnabled && <span className="text-gray-400 text-sm">%</span>}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          id="shopifyFee"
                          checked={inputs.shopifyFeeEnabled}
                          onChange={(e) => handleInputChange('shopifyFeeEnabled', e.target.checked)}
                          className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                        />
                        <label htmlFor="shopifyFee" className="text-gray-300">Shopify Fee</label>
                        {inputs.shopifyFeeEnabled && (
                          <input
                            type="number"
                            step="0.1"
                            value={inputs.shopifyFee}
                            onChange={(e) => handleInputChange('shopifyFee', parseFloat(e.target.value) || 0)}
                            className="w-20 rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-sm"
                          />
                        )}
                        {inputs.shopifyFeeEnabled && <span className="text-gray-400 text-sm">%</span>}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          id="shopifyTransaction"
                          checked={inputs.shopifyTransactionEnabled}
                          onChange={(e) => handleInputChange('shopifyTransactionEnabled', e.target.checked)}
                          className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                        />
                        <label htmlFor="shopifyTransaction" className="text-gray-300">Shopify Transaction Fee</label>
                        {inputs.shopifyTransactionEnabled && (
                          <>
                            <input
                              type="number"
                              step="0.01"
                              value={inputs.shopifyTransactionFee}
                              onChange={(e) => handleInputChange('shopifyTransactionFee', parseFloat(e.target.value) || 0)}
                              className="w-20 rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-sm"
                            />
                            <CurrencyToggle 
                              currency={inputs.shopifyTransactionCurrency} 
                              setCurrency={(currency) => handleInputChange('shopifyTransactionCurrency', currency)} 
                            />
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>



                {/* Packaging Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="packaging"
                      checked={inputs.packagingEnabled}
                      onChange={(e) => handleInputChange('packagingEnabled', e.target.checked)}
                      className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                    />
                    <label htmlFor="packaging" className="text-white font-medium">Packaging Costs</label>
                  </div>
                  {inputs.packagingEnabled && (
                    <div className="ml-6 space-y-4">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          id="paquetes"
                          checked={inputs.paquetesEnabled}
                          onChange={(e) => handleInputChange('paquetesEnabled', e.target.checked)}
                          className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                        />
                        <label htmlFor="paquetes" className="text-gray-300">Paquetes</label>
                        {inputs.paquetesEnabled && (
                          <>
                            <input
                              type="number"
                              step="0.01"
                              value={inputs.paquetesAmount}
                              onChange={(e) => handleInputChange('paquetesAmount', parseFloat(e.target.value) || 0)}
                              className="w-24 rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-sm"
                            />
                            <CurrencyToggle 
                              currency={inputs.paquetesCurrency} 
                              setCurrency={(currency) => handleInputChange('paquetesCurrency', currency)} 
                            />
                            {inputs.customExchangeRatesEnabled && (
                              <>
                                <label className="text-gray-400 text-xs">XR:</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={inputs.paquetesCustomExchangeRate}
                                  onChange={(e) => handleInputChange('paquetesCustomExchangeRate', parseFloat(e.target.value) || 0)}
                                  className="w-16 rounded-md bg-gray-600 border-gray-500 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-xs"
                                />
                              </>
                            )}
                            <span className="text-gray-500 text-xs italic ml-4">
                              {(() => {
                                const perUnit = calculatePerUnitCost(inputs.paquetesAmount, inputs.paquetesCurrency, inputs.paquetesCustomExchangeRate);
                                return `${perUnit.usd.toFixed(2)} USD or ${perUnit.pen.toFixed(2)} PEN per unit`;
                              })()}
                            </span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          id="stickers"
                          checked={inputs.stickersEnabled}
                          onChange={(e) => handleInputChange('stickersEnabled', e.target.checked)}
                          className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                        />
                        <label htmlFor="stickers" className="text-gray-300">Stickers</label>
                        {inputs.stickersEnabled && (
                          <>
                            <input
                              type="number"
                              step="0.01"
                              value={inputs.stickersAmount}
                              onChange={(e) => handleInputChange('stickersAmount', parseFloat(e.target.value) || 0)}
                              className="w-24 rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-sm"
                            />
                            <CurrencyToggle 
                              currency={inputs.stickersCurrency} 
                              setCurrency={(currency) => handleInputChange('stickersCurrency', currency)} 
                            />
                            {inputs.customExchangeRatesEnabled && (
                              <>
                                <label className="text-gray-400 text-xs">XR:</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={inputs.stickersCustomExchangeRate}
                                  onChange={(e) => handleInputChange('stickersCustomExchangeRate', parseFloat(e.target.value) || 0)}
                                  className="w-16 rounded-md bg-gray-600 border-gray-500 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-xs"
                                />
                              </>
                            )}
                            <span className="text-gray-500 text-xs italic ml-4">
                              {(() => {
                                const perUnit = calculatePerUnitCost(inputs.stickersAmount, inputs.stickersCurrency, inputs.stickersCustomExchangeRate);
                                return `${perUnit.usd.toFixed(2)} USD or ${perUnit.pen.toFixed(2)} PEN per unit`;
                              })()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="delivery"
                      checked={inputs.deliveryEnabled}
                      onChange={(e) => handleInputChange('deliveryEnabled', e.target.checked)}
                      className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                    />
                    <label htmlFor="delivery" className="text-white font-medium">Delivery Costs</label>
                  </div>
                  {inputs.deliveryEnabled && (
                    <div className="ml-6">
                      <div className="flex items-center space-x-4">
                        <label className="text-gray-300">Per Unit</label>
                        <input
                          type="number"
                          step="0.01"
                          value={inputs.deliveryPerUnit}
                          onChange={(e) => handleInputChange('deliveryPerUnit', parseFloat(e.target.value) || 0)}
                          className="w-24 rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-sm"
                        />
                        <CurrencyToggle 
                          currency={inputs.deliveryCurrency} 
                          setCurrency={(currency) => handleInputChange('deliveryCurrency', currency)} 
                        />
                        <span className="text-gray-400 text-sm">each</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recurring Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={inputs.recurringEnabled}
                      onChange={(e) => handleInputChange('recurringEnabled', e.target.checked)}
                      className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                    />
                    <label htmlFor="recurring" className="text-white font-medium">Recurring Expenses</label>
                  </div>
                  {inputs.recurringEnabled && (
                    <div className="ml-6 space-y-4">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          id="appleDev"
                          checked={inputs.appleDevEnabled}
                          onChange={(e) => handleInputChange('appleDevEnabled', e.target.checked)}
                          className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                        />
                        <label htmlFor="appleDev" className="text-gray-300">Apple Dev Program</label>
                        {inputs.appleDevEnabled && (
                          <>
                            <input
                              type="number"
                              step="0.01"
                              value={inputs.appleDevAmount}
                              onChange={(e) => handleInputChange('appleDevAmount', parseFloat(e.target.value) || 0)}
                              className="w-24 rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-sm"
                            />
                            <CurrencyToggle 
                              currency={inputs.appleDevCurrency} 
                              setCurrency={(currency) => handleInputChange('appleDevCurrency', currency)} 
                            />
                            {inputs.customExchangeRatesEnabled && (
                              <>
                                <label className="text-gray-400 text-xs">XR:</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={inputs.appleDevCustomExchangeRate}
                                  onChange={(e) => handleInputChange('appleDevCustomExchangeRate', parseFloat(e.target.value) || 0)}
                                  className="w-16 rounded-md bg-gray-600 border-gray-500 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-xs"
                                />
                              </>
                            )}
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          id="googleWorkspace"
                          checked={inputs.googleWorkspaceEnabled}
                          onChange={(e) => handleInputChange('googleWorkspaceEnabled', e.target.checked)}
                          className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                        />
                        <label htmlFor="googleWorkspace" className="text-gray-300">Google Workspace</label>
                        {inputs.googleWorkspaceEnabled && (
                          <>
                            <input
                              type="number"
                              step="0.01"
                              value={inputs.googleWorkspaceAmount}
                              onChange={(e) => handleInputChange('googleWorkspaceAmount', parseFloat(e.target.value) || 0)}
                              className="w-24 rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-sm"
                            />
                            <CurrencyToggle 
                              currency={inputs.googleWorkspaceCurrency} 
                              setCurrency={(currency) => handleInputChange('googleWorkspaceCurrency', currency)} 
                            />
                            {inputs.customExchangeRatesEnabled && (
                              <>
                                <label className="text-gray-400 text-xs">XR:</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={inputs.googleWorkspaceCustomExchangeRate}
                                  onChange={(e) => handleInputChange('googleWorkspaceCustomExchangeRate', parseFloat(e.target.value) || 0)}
                                  className="w-16 rounded-md bg-gray-600 border-gray-500 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-xs"
                                />
                              </>
                            )}
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          id="shopifyRecurring"
                          checked={inputs.shopifyRecurringEnabled}
                          onChange={(e) => handleInputChange('shopifyRecurringEnabled', e.target.checked)}
                          className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                        />
                        <label htmlFor="shopifyRecurring" className="text-gray-300">Shopify</label>
                        {inputs.shopifyRecurringEnabled && (
                          <>
                            <input
                              type="number"
                              step="0.01"
                              value={inputs.shopifyRecurringAmount}
                              onChange={(e) => handleInputChange('shopifyRecurringAmount', parseFloat(e.target.value) || 0)}
                              className="w-24 rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-sm"
                            />
                            <CurrencyToggle 
                              currency={inputs.shopifyRecurringCurrency} 
                              setCurrency={(currency) => handleInputChange('shopifyRecurringCurrency', currency)} 
                            />
                            {inputs.customExchangeRatesEnabled && (
                              <>
                                <label className="text-gray-400 text-xs">XR:</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={inputs.shopifyRecurringCustomExchangeRate}
                                  onChange={(e) => handleInputChange('shopifyRecurringCustomExchangeRate', parseFloat(e.target.value) || 0)}
                                  className="w-16 rounded-md bg-gray-600 border-gray-500 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-xs"
                                />
                              </>
                            )}
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          id="contabilidad"
                          checked={inputs.contabilidadEnabled}
                          onChange={(e) => handleInputChange('contabilidadEnabled', e.target.checked)}
                          className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                        />
                        <label htmlFor="contabilidad" className="text-gray-300">Contabilidad</label>
                        {inputs.contabilidadEnabled && (
                          <>
                            <input
                              type="number"
                              step="0.01"
                              value={inputs.contabilidadAmount}
                              onChange={(e) => handleInputChange('contabilidadAmount', parseFloat(e.target.value) || 0)}
                              className="w-24 rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-sm"
                            />
                            <CurrencyToggle 
                              currency={inputs.contabilidadCurrency} 
                              setCurrency={(currency) => handleInputChange('contabilidadCurrency', currency)} 
                            />
                            {inputs.customExchangeRatesEnabled && (
                              <>
                                <label className="text-gray-400 text-xs">XR:</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={inputs.contabilidadCustomExchangeRate}
                                  onChange={(e) => handleInputChange('contabilidadCustomExchangeRate', parseFloat(e.target.value) || 0)}
                                  className="w-16 rounded-md bg-gray-600 border-gray-500 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-xs"
                                />
                              </>
                            )}
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          id="firebase"
                          checked={inputs.firebaseEnabled}
                          onChange={(e) => handleInputChange('firebaseEnabled', e.target.checked)}
                          className="rounded bg-gray-700 border-gray-600 text-[#2FFFCC] focus:ring-[#2FFFCC]"
                        />
                        <label htmlFor="firebase" className="text-gray-300">Cloud (Firebase)</label>
                        {inputs.firebaseEnabled && (
                          <>
                            <input
                              type="number"
                              step="0.01"
                              value={inputs.firebaseAmount}
                              onChange={(e) => handleInputChange('firebaseAmount', parseFloat(e.target.value) || 0)}
                              className="w-24 rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-sm"
                            />
                            <CurrencyToggle 
                              currency={inputs.firebaseCurrency} 
                              setCurrency={(currency) => handleInputChange('firebaseCurrency', currency)} 
                            />
                            {inputs.customExchangeRatesEnabled && (
                              <>
                                <label className="text-gray-400 text-xs">XR:</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={inputs.firebaseCustomExchangeRate}
                                  onChange={(e) => handleInputChange('firebaseCustomExchangeRate', parseFloat(e.target.value) || 0)}
                                  className="w-16 rounded-md bg-gray-600 border-gray-500 text-white shadow-sm focus:border-[#2FFFCC] focus:ring focus:ring-[#2FFFCC] focus:ring-opacity-50 p-1 text-xs"
                                />
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-white flex items-center">
            <Calculator className="w-6 h-6 mr-3 text-[#2FFFCC]" />
            Financial Summary
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 text-gray-300 font-medium">Metric</th>
                  <th className="text-right py-3 text-gray-300 font-medium">PEN</th>
                  <th className="text-right py-3 text-gray-300 font-medium">USD</th>
                  <th className="text-right py-3 text-gray-300 font-medium">% of Total</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b border-gray-700/50">
                  <td className="py-3 text-white">Gross Revenue</td>
                  <td className="py-3 text-right text-green-400 font-semibold">{formatCurrency(financialSummary.grossRevenuePEN, 'PEN')}</td>
                  <td className="py-3 text-right text-green-400 font-semibold">{formatCurrency(financialSummary.grossRevenueUSD, 'USD')}</td>
                  <td className="py-3 text-right text-gray-300 font-semibold">100.0%</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-3 text-white">COGS</td>
                  <td className="py-3 text-right text-red-400">{formatCurrency(financialSummary.cogsPEN, 'PEN')}</td>
                  <td className="py-3 text-right text-red-400">{formatCurrency(financialSummary.cogsUSD, 'USD')}</td>
                  <td className="py-3 text-right text-red-300">{formatPercentage(financialSummary.cogsUSD, financialSummary.grossRevenueUSD)}</td>
                </tr>
                <tr className="border-b border-gray-700/50 bg-gray-700/20">
                  <td className="py-3 text-white font-semibold">Gross Margin</td>
                  <td className="py-3 text-right text-blue-400 font-semibold">{formatCurrency(financialSummary.grossMarginPEN, 'PEN')}</td>
                  <td className="py-3 text-right text-blue-400 font-semibold">{formatCurrency(financialSummary.grossMarginUSD, 'USD')}</td>
                  <td className="py-3 text-right text-blue-300 font-semibold">{formatPercentage(financialSummary.grossMarginUSD, financialSummary.grossRevenueUSD)}</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-3 text-white">Shipping Costs</td>
                  <td className="py-3 text-right text-red-400">{formatCurrency(financialSummary.shippingCostsPEN, 'PEN')}</td>
                  <td className="py-3 text-right text-red-400">{formatCurrency(financialSummary.shippingCostsUSD, 'USD')}</td>
                  <td className="py-3 text-right text-red-300">{formatPercentage(financialSummary.shippingCostsUSD, financialSummary.grossRevenueUSD)}</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-3 text-white">Packaging Costs</td>
                  <td className="py-3 text-right text-red-400">{formatCurrency(financialSummary.packagingCostsPEN, 'PEN')}</td>
                  <td className="py-3 text-right text-red-400">{formatCurrency(financialSummary.packagingCostsUSD, 'USD')}</td>
                  <td className="py-3 text-right text-red-300">{formatPercentage(financialSummary.packagingCostsUSD, financialSummary.grossRevenueUSD)}</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-3 text-white">Delivery Costs</td>
                  <td className="py-3 text-right text-red-400">{formatCurrency(financialSummary.deliveryCostsPEN, 'PEN')}</td>
                  <td className="py-3 text-right text-red-400">{formatCurrency(financialSummary.deliveryCostsUSD, 'USD')}</td>
                  <td className="py-3 text-right text-red-300">{formatPercentage(financialSummary.deliveryCostsUSD, financialSummary.grossRevenueUSD)}</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-3 text-white">Recurring Monthly Expenses</td>
                  <td className="py-3 text-right text-red-400">{formatCurrency(financialSummary.recurringMonthlyPEN, 'PEN')}</td>
                  <td className="py-3 text-right text-red-400">{formatCurrency(financialSummary.recurringMonthlyUSD, 'USD')}</td>
                  <td className="py-3 text-right text-red-300">{formatPercentage(financialSummary.recurringMonthlyUSD, financialSummary.grossRevenueUSD)}</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-3 text-white">Sale Costs</td>
                  <td className="py-3 text-right text-red-400">{formatCurrency(financialSummary.totalSaleCostsPEN, 'PEN')}</td>
                  <td className="py-3 text-right text-red-400">{formatCurrency(financialSummary.totalSaleCostsUSD, 'USD')}</td>
                  <td className="py-3 text-right text-red-300">{formatPercentage(financialSummary.totalSaleCostsUSD, financialSummary.grossRevenueUSD)}</td>
                </tr>
                {financialSummary.dynamicCostsUSD > 0 && (
                  <tr className="border-b border-gray-700/50">
                    <td className="py-3 text-white">Custom Costs</td>
                    <td className="py-3 text-right text-red-400">{formatCurrency(financialSummary.dynamicCostsPEN, 'PEN')}</td>
                    <td className="py-3 text-right text-red-400">{formatCurrency(financialSummary.dynamicCostsUSD, 'USD')}</td>
                    <td className="py-3 text-right text-red-300">{formatPercentage(financialSummary.dynamicCostsUSD, financialSummary.grossRevenueUSD)}</td>
                  </tr>
                )}
                <tr className="border-b border-gray-700/50 bg-gray-700/20">
                  <td className="py-3 text-white font-semibold">Operating Expenses</td>
                  <td className="py-3 text-right text-red-400 font-semibold">{formatCurrency(financialSummary.operatingExpensesPEN, 'PEN')}</td>
                  <td className="py-3 text-right text-red-400 font-semibold">{formatCurrency(financialSummary.operatingExpensesUSD, 'USD')}</td>
                  <td className="py-3 text-right text-red-300 font-semibold">{formatPercentage(financialSummary.operatingExpensesUSD, financialSummary.grossRevenueUSD)}</td>
                </tr>
                <tr className="border-b border-gray-700/50 bg-gray-700/20">
                  <td className="py-3 text-white font-semibold">Operating Margin</td>
                  <td className="py-3 text-right text-blue-400 font-semibold">{formatCurrency(financialSummary.operatingMarginPEN, 'PEN')}</td>
                  <td className="py-3 text-right text-blue-400 font-semibold">{formatCurrency(financialSummary.operatingMarginUSD, 'USD')}</td>
                  <td className="py-3 text-right text-blue-300 font-semibold">{formatPercentage(financialSummary.operatingMarginUSD, financialSummary.grossRevenueUSD)}</td>
                </tr>
                {inputs.igvEnabled && (
                  <tr className="border-b border-gray-700/50">
                    <td className="py-3 text-white">Tax (IGV)</td>
                    <td className="py-3 text-right text-yellow-400">{formatCurrency(financialSummary.igvCollectedPEN, 'PEN')}</td>
                    <td className="py-3 text-right text-yellow-400">{formatCurrency(financialSummary.igvCollected, 'USD')}</td>
                    <td className="py-3 text-right text-yellow-300">{formatPercentage(financialSummary.igvCollected, financialSummary.grossRevenueUSD)}</td>
                  </tr>
                )}
                <tr className="border-b-2 border-gray-600 bg-gray-700/20">
                  <td className="py-3 text-white font-semibold">Net Profit</td>
                  <td className="py-3 text-right text-blue-400 font-semibold">{formatCurrency(financialSummary.netProfitPEN, 'PEN')}</td>
                  <td className="py-3 text-right text-blue-400 font-semibold">{formatCurrency(financialSummary.netProfitUSD, 'USD')}</td>
                  <td className="py-3 text-right text-blue-300 font-semibold">{formatPercentage(financialSummary.netProfitUSD, financialSummary.grossRevenueUSD)}</td>
                </tr>
                <tr>
                  <td className="py-3 text-white font-bold">Break-even Units</td>
                  <td className="py-3 text-right text-orange-400 font-bold" colSpan={3}>
                    {financialSummary.breakEvenUnits} units
                    <div className="text-xs text-gray-400 font-normal mt-1">
                      Fixed: {formatCurrency(financialSummary.fixedCostsUSD, 'USD')} ÷ ({formatCurrency(financialSummary.sellingPricePerUnit, 'USD')} - {formatCurrency(financialSummary.variableCostPerUnit, 'USD')}) per unit
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>


        </div>

        {/* Cascade/Waterfall Chart */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-[#2FFFCC]" />
            Financial Cascade
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cascadeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(Math.abs(value), 'USD'),
                    name === 'value' ? 'Amount' : name
                  ]}
                />
                {/* Invisible bars to create the waterfall base positions */}
                <Bar 
                  dataKey="start" 
                  stackId="waterfall"
                  fill="transparent"
                />
                {/* Visible bars for the actual values */}
                <Bar 
                  dataKey="value" 
                  stackId="waterfall"
                  fill="#2FFFCC"
                >
                  {cascadeData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.type === 'positive' ? '#2FFFCC' : '#EF4444'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>



        {/* Recurring Monthly Expenses */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-white flex items-center">
            <DollarSign className="w-6 h-6 mr-3 text-[#2FFFCC]" />
            Recurring Monthly Expenses
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 text-gray-300 font-medium">Service</th>
                  <th className="text-right py-3 text-gray-300 font-medium">Monthly Cost (USD)</th>
                </tr>
              </thead>
              <tbody>
                {recurringExpenses.map((expense, index) => (
                  <tr key={index} className="border-b border-gray-700/50">
                    <td className="py-3 text-white">{expense.service}</td>
                    <td className="py-3 text-right text-gray-300">{formatCurrency(expense.monthlyCostUSD, 'USD')}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-600">
                  <td className="py-4 text-white font-bold">Total Monthly</td>
                  <td className="py-4 text-right text-[#2FFFCC] font-bold">
                    {formatCurrency(recurringExpenses.reduce((sum, exp) => sum + exp.monthlyCostUSD, 0), 'USD')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Breakeven Analysis Section */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-white flex items-center">
            <Calculator className="w-6 h-6 mr-3 text-[#2FFFCC]" />
            Breakeven Analysis
            </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scenario Analysis */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">📊 Cost Scenario Analysis</h3>
              
              {(() => {
                const baseRevenue = financialSummary.sellingPricePerUnit;
                const cogs = financialSummary.variableCostPerUnit;
                const shipping = (financialSummary.shippingCostsUSD / inputs.unitsOrdered) || 0;
                const packaging = (financialSummary.packagingCostsUSD / inputs.unitsOrdered) || 0;
                const delivery = (financialSummary.deliveryCostsUSD / inputs.unitsSold) || 0;
                const saleCosts = (financialSummary.totalSaleCostsUSD / inputs.unitsSold) || 0;
                const monthlyFixed = financialSummary.recurringMonthlyUSD;
                const taxRate = inputs.igvEnabled ? inputs.igvRate / 100 : 0;

                const scenarios = [
                  { name: "COGS Only", costs: [cogs], color: "bg-blue-500/20 border-blue-500" },
                  { name: "COGS + Shipping", costs: [cogs, shipping], color: "bg-green-500/20 border-green-500" },
                  { name: "COGS + Shipping + Packaging", costs: [cogs, shipping, packaging], color: "bg-yellow-500/20 border-yellow-500" },
                  { name: "COGS + Shipping + Packaging + Delivery", costs: [cogs, shipping, packaging, delivery], color: "bg-orange-500/20 border-orange-500" },
                  { name: "All Variable Costs", costs: [cogs, shipping, packaging, delivery, saleCosts], color: "bg-red-500/20 border-red-500" }
                ];

                return scenarios.map((scenario, index) => {
                  const variableCost = scenario.costs.reduce((sum, cost) => sum + cost, 0);
                  const contributionMargin = baseRevenue - variableCost;
                  const contributionAfterTax = contributionMargin * (1 - taxRate);
                  const breakevenUnits = monthlyFixed > 0 ? Math.ceil(monthlyFixed / contributionAfterTax) : 0;
                  const profitAt50 = (50 * contributionAfterTax) - monthlyFixed;
                  const profitAt100 = (100 * contributionAfterTax) - monthlyFixed;
                  const monthsToBreakeven = Math.ceil(breakevenUnits / 30); // Assuming 30 units/month
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${scenario.color}`}>
                      <h4 className="font-semibold text-white mb-3">{scenario.name}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Variable Cost/Unit</p>
                          <p className="text-white font-semibold">{formatCurrency(variableCost, 'USD')}</p>
                </div>
                        <div>
                          <p className="text-gray-400">Contribution Margin</p>
                          <p className="text-white font-semibold">{formatCurrency(contributionAfterTax, 'USD')}</p>
              </div>
                        <div>
                          <p className="text-gray-400">Breakeven Units</p>
                          <p className="text-[#2FFFCC] font-bold">{breakevenUnits} units</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Months to Breakeven</p>
                          <p className="text-[#2FFFCC] font-bold">{monthsToBreakeven} months</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-400">Profit @ 50 units</p>
                          <p className={`font-semibold ${profitAt50 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatCurrency(profitAt50, 'USD')}
                          </p>
              </div>
                        <div>
                          <p className="text-gray-400">Profit @ 100 units</p>
                          <p className={`font-semibold ${profitAt100 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatCurrency(profitAt100, 'USD')}
                          </p>
            </div>
                      </div>
                    </div>
                  );
                });
              })()}
        </div>

            {/* Summary Table */}
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">📋 Quick Comparison</h3>
              <div className="space-y-3">
                {(() => {
                  const baseRevenue = financialSummary.sellingPricePerUnit;
                  const cogs = financialSummary.variableCostPerUnit;
                  const shipping = (financialSummary.shippingCostsUSD / inputs.unitsOrdered) || 0;
                  const packaging = (financialSummary.packagingCostsUSD / inputs.unitsOrdered) || 0;
                  const delivery = (financialSummary.deliveryCostsUSD / inputs.unitsSold) || 0;
                  const saleCosts = (financialSummary.totalSaleCostsUSD / inputs.unitsSold) || 0;
                  const monthlyFixed = financialSummary.recurringMonthlyUSD;
                  const taxRate = inputs.igvEnabled ? inputs.igvRate / 100 : 0;

                  const scenarios = [
                    { name: "Conservative", costs: [cogs] },
                    { name: "Moderate", costs: [cogs, shipping, packaging] },
                    { name: "Realistic", costs: [cogs, shipping, packaging, delivery, saleCosts] }
                  ];

                  return scenarios.map((scenario, index) => {
                    const variableCost = scenario.costs.reduce((sum, cost) => sum + cost, 0);
                    const contributionAfterTax = (baseRevenue - variableCost) * (1 - taxRate);
                    const breakevenUnits = monthlyFixed > 0 ? Math.ceil(monthlyFixed / contributionAfterTax) : 0;
                    
                    return (
                      <div key={index} className="bg-gray-600/50 p-3 rounded border-l-2 border-[#2FFFCC]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white font-medium">{scenario.name}</span>
                          <span className="text-[#2FFFCC] font-bold">{breakevenUnits}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Variable: {formatCurrency(variableCost, 'USD')} | 
                          Margin: {formatCurrency(contributionAfterTax, 'USD')}
                        </div>
                      </div>
                    );
                  });
                })()}
          </div>

              {/* Key Metrics */}
              <div className="mt-6 p-3 bg-[#2FFFCC]/10 rounded border border-[#2FFFCC]/30">
                <h4 className="text-white font-semibold mb-2">🎯 Current Position</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Units Ordered:</span>
                    <span className="text-white">{inputs.unitsOrdered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Units Sold:</span>
                    <span className="text-white">{inputs.unitsSold}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Revenue/Unit:</span>
                    <span className="text-white">{formatCurrency(financialSummary.sellingPricePerUnit, 'USD')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Monthly Fixed:</span>
                    <span className="text-white">{formatCurrency(financialSummary.recurringMonthlyUSD, 'USD')}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-600 pt-1 mt-2">
                    <span className="text-gray-300">Breakeven Need:</span>
                    <span className="text-[#2FFFCC] font-bold">{financialSummary.breakEvenUnits} units</span>
                  </div>
                </div>
              </div>
          </div>
        </div>

          {/* Profitability Timeline */}
          <div className="mt-6 bg-gray-700/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">📈 Profitability Timeline</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(() => {
                const baseRevenue = financialSummary.sellingPricePerUnit;
                const allVariableCosts = financialSummary.variableCostPerUnit + 
                  ((financialSummary.shippingCostsUSD + financialSummary.packagingCostsUSD + financialSummary.deliveryCostsUSD + financialSummary.totalSaleCostsUSD) / Math.max(inputs.unitsSold, 1));
                const contributionAfterTax = (baseRevenue - allVariableCosts) * (1 - (inputs.igvEnabled ? inputs.igvRate / 100 : 0));
                const monthlyFixed = financialSummary.recurringMonthlyUSD;
                
                const unitLevels = [25, 50, 75, 100, 125, 150];
                
                return unitLevels.map(units => {
                  const profit = (units * contributionAfterTax) - monthlyFixed;
                  const isPositive = profit >= 0;
                  
                  return (
                    <div key={units} className={`p-3 rounded text-center ${isPositive ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
                      <div className="text-white font-bold">{units} units</div>
                      <div className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(profit, 'USD')}
                      </div>
                      <div className="text-xs text-gray-400">
                        {isPositive ? '✅ Profitable' : '❌ Loss'}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinancialsPage;
