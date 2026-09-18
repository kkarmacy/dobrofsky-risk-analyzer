const div=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&b!==0?a/b:null;
export function analyzeEarningsQuality(periods){
 const series=periods.map(({period,financials:f})=>({period,netIncome:f.netIncome,operatingCashFlow:f.operatingCashFlow,cashConversion:div(f.operatingCashFlow,f.netIncome),receivablesToRevenue:div(f.accountsReceivable,f.revenue),inventoryToRevenue:div(f.inventory,f.revenue)}));
 const alerts=[]; const a=series.at(-1),b=series.at(-2);
 if(a&&Number.isFinite(a.netIncome)&&Number.isFinite(a.operatingCashFlow)&&a.netIncome>0&&a.operatingCashFlow<a.netIncome)alerts.push('Operating cash flow is below reported net income.');
 if(a&&b&&a.receivablesToRevenue>b.receivablesToRevenue*1.15)alerts.push('Receivables are growing materially faster than revenue.');
 if(a&&b&&a.inventoryToRevenue>b.inventoryToRevenue*1.15)alerts.push('Inventory intensity has increased materially versus the prior period.');
 return {series,alerts};
}
