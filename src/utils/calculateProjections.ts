export interface ProjectionMonth {
  month: number;
  units: number;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
}

export interface ProjectionInputs {
  startUnits: number;
  growthRate: number; // as a percentage, e.g., 10 for 10%
  unitPrice: number;
  unitCost: number;
  timeFrame: number; // in months
}

export const calculateProjections = (inputs: ProjectionInputs): ProjectionMonth[] => {
  const { startUnits, growthRate, unitPrice, unitCost, timeFrame } = inputs;
  const monthlyData: ProjectionMonth[] = [];
  const growthFactor = 1 + growthRate / 100;

  let currentUnits = startUnits;

  for (let month = 1; month <= timeFrame; month++) {
    const revenue = currentUnits * unitPrice;
    const cost = currentUnits * unitCost;
    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    monthlyData.push({
      month,
      units: Math.round(currentUnits),
      revenue,
      cost,
      profit,
      margin,
    });

    // Apply growth for the next month
    currentUnits *= growthFactor;
  }

  return monthlyData;
}; 