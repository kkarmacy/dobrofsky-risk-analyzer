const safeDivide = (a, b) => (Number.isFinite(a) && Number.isFinite(b) && b !== 0 ? a / b : null);

export function calculateRatios(f) {
  return {
    currentRatio: safeDivide(f.currentAssets, f.currentLiabilities),
    debtToAssets: safeDivide(f.totalDebt, f.totalAssets),
    debtToEquity: safeDivide(f.totalDebt, f.totalEquity),
    interestCoverage: safeDivide(f.ebit, f.interestExpense),
    operatingMargin: safeDivide(f.operatingIncome, f.revenue),
    netMargin: safeDivide(f.netIncome, f.revenue),
    ocfToDebt: safeDivide(f.operatingCashFlow, f.totalDebt),
    receivablesToRevenue: safeDivide(f.accountsReceivable, f.revenue),
    inventoryToRevenue: safeDivide(f.inventory, f.revenue)
  };
}
