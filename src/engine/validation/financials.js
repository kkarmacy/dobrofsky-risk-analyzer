const REQUIRED = [
  'revenue','currentAssets','currentLiabilities','totalAssets','totalDebt',
  'totalEquity','ebit','interestExpense','operatingIncome','netIncome','operatingCashFlow'
];

export function validateFinancials(financials) {
  const errors = [];
  const warnings = [];
  if (!financials || typeof financials !== 'object') return { valid: false, errors: ['Financial data is required.'], warnings };

  for (const field of REQUIRED) {
    if (!Number.isFinite(financials[field])) errors.push(`${field} must be a finite number.`);
  }
  if (financials.revenue === 0) warnings.push('Revenue is zero; margin ratios cannot be calculated.');
  if (financials.totalAssets <= 0) warnings.push('Total assets should normally be positive.');
  if (financials.interestExpense === 0) warnings.push('Interest coverage is undefined when interest expense is zero.');
  if (Number.isFinite(financials.totalAssets) && Number.isFinite(financials.totalDebt) && financials.totalDebt > financials.totalAssets * 5) warnings.push('Debt is unusually large relative to assets; verify units and source data.');

  return { valid: errors.length === 0, errors, warnings };
}
