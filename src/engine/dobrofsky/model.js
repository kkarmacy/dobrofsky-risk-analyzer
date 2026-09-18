import { calculateRatios } from '../financial/ratios.js';
import { validateFinancials } from '../validation/financials.js';

const clamp = n => Math.max(0, Math.min(100, n));
const riskFromHigherIsWorse = (value, healthy, stressed) => value == null ? 50 : clamp(((value - healthy) / (stressed - healthy)) * 100);
const riskFromLowerIsWorse = (value, stressed, healthy) => value == null ? 50 : clamp(((healthy - value) / (healthy - stressed)) * 100);

export function analyzeDobrofsky(financials) {
  const validation = validateFinancials(financials);
  if (!validation.valid) return { ok: false, validation };

  const r = calculateRatios(financials);
  const components = {
    liquidity: riskFromLowerIsWorse(r.currentRatio, 0.8, 2),
    solvency: riskFromHigherIsWorse(r.debtToAssets, 0.3, 0.8),
    coverage: riskFromLowerIsWorse(r.interestCoverage, 1, 5),
    profitability: riskFromLowerIsWorse(r.operatingMargin, 0, 0.2),
    cashFlow: riskFromLowerIsWorse(r.ocfToDebt, 0, 0.3)
  };

  // Placeholder research weights. They must be calibrated and versioned through empirical backtesting.
  const weights = { liquidity: .15, solvency: .25, coverage: .20, profitability: .15, cashFlow: .25 };
  const score = Math.round(Object.entries(components).reduce((sum,[k,v]) => sum + v * weights[k], 0));
  const classification = score < 25 ? 'normal' : score < 45 ? 'watch' : score < 65 ? 'elevated' : score < 80 ? 'high' : 'critical';
  const drivers = Object.entries(components).sort((a,b) => b[1]-a[1]).slice(0,3).map(([factor,risk]) => ({ factor, risk: Math.round(risk) }));

  return {
    ok: true,
    model: { name: 'Dobrofsky Risk Model', version: '0.1-research', calibrated: false },
    score,
    classification,
    components: Object.fromEntries(Object.entries(components).map(([k,v]) => [k, Math.round(v)])),
    drivers,
    ratios: r,
    validation,
    disclaimer: 'Research estimate only. Thresholds and weights require empirical calibration and backtesting before predictive use.'
  };
}
