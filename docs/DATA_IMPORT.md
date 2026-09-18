# Data Import Specification

The analyzer should accept normalized JSON first, with CSV/XLSX adapters added at the application boundary.

## Required core fields
revenue, currentAssets, currentLiabilities, totalAssets, totalDebt, totalEquity, ebit, interestExpense, operatingIncome, netIncome, operatingCashFlow.

## Recommended fields
accountsReceivable, inventory, totalLiabilities, retainedEarnings, marketValueEquity, sharesOutstanding, fiscalPeriod, currency, units, sector and sourceDate.

## Controls
- Never silently mix currencies or units.
- Preserve the original source and fiscal period.
- Reject non-finite values and flag accounting inconsistencies.
- Historical analysis must use point-in-time information to avoid look-ahead bias.
- Imported benchmark datasets must state population, period, sector definition and methodology.
