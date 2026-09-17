import { analyzeDobrofsky } from '../dobrofsky/model.js';

export function applyStress(financials, scenario = {}) {
  const revenueShock = scenario.revenuePct ?? 0;
  const ebitShock = scenario.ebitPct ?? 0;
  const ocfShock = scenario.operatingCashFlowPct ?? 0;
  const interestShock = scenario.interestExpensePct ?? 0;

  const stressed = {
    ...financials,
    revenue: financials.revenue * (1 + revenueShock),
    ebit: financials.ebit * (1 + ebitShock),
    operatingIncome: financials.operatingIncome * (1 + ebitShock),
    operatingCashFlow: financials.operatingCashFlow * (1 + ocfShock),
    interestExpense: financials.interestExpense * (1 + interestShock)
  };

  return { scenario, stressedFinancials: stressed, analysis: analyzeDobrofsky(stressed) };
}

export function compareStress(financials, scenario) {
  return { baseline: analyzeDobrofsky(financials), stressed: applyStress(financials, scenario).analysis };
}
