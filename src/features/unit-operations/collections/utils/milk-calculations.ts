export const calculateSnfPercentage = (fat: number, clr: number): number => {
  if (!fat || !clr) return 0;
  // Formula: ((CLR + Fat) / 4) + 0.44
  const snf = (clr + fat) / 4 + 0.44;
  return Number(snf.toFixed(2));
};

export const calculateKg = (quantity: number, percentage: number): number => {
  if (!quantity || !percentage) return 0;
  // Formula: (Quantity * Percentage) / 100
  const kg = (quantity * percentage) / 100;
  return Number(kg.toFixed(3));
};
