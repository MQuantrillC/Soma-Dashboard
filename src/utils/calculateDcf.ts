import { ProjectionMonth } from "./calculateProjections";

export interface DcfMonth extends ProjectionMonth {
  taxedProfit: number;
  discountedProfit: number;
  cumulativeNpv: number;
}

export interface DcfInputs {
  projectionData: ProjectionMonth[];
  discountRate: number; // as a percentage, e.g., 12 for 12%
  taxRate: number; // as a percentage, e.g., 29.5 for 29.5%
  applyTax: boolean;
}

export const calculateDcf = (inputs: DcfInputs): DcfMonth[] => {
  const { projectionData, discountRate, taxRate, applyTax } = inputs;
  const monthlyDiscountRate = Math.pow(1 + discountRate / 100, 1 / 12) - 1;
  
  let cumulativeNpv = 0;
  
  return projectionData.map((month, index) => {
    const profit = month.profit;
    const taxedProfit = applyTax ? profit * (1 - taxRate / 100) : profit;
    const discountedProfit = taxedProfit / Math.pow(1 + monthlyDiscountRate, index + 1);
    
    cumulativeNpv += discountedProfit;

    return {
      ...month,
      taxedProfit,
      discountedProfit,
      cumulativeNpv,
    };
  });
}; 