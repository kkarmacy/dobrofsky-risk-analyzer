import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeDobrofsky } from '../src/engine/dobrofsky/model.js';
import { compareStress } from '../src/engine/risk/stress.js';

const healthy = {
  revenue: 1000, currentAssets: 500, currentLiabilities: 250, totalAssets: 1500,
  totalDebt: 450, totalEquity: 1050, ebit: 200, interestExpense: 40,
  operatingIncome: 200, netIncome: 140, operatingCashFlow: 180,
  accountsReceivable: 120, inventory: 100
};

test('returns an explainable bounded score', () => {
  const result = analyzeDobrofsky(healthy);
  assert.equal(result.ok, true);
  assert.ok(result.score >= 0 && result.score <= 100);
  assert.equal(result.drivers.length, 3);
  assert.equal(result.model.calibrated, false);
});

test('rejects incomplete financial statements', () => {
  assert.equal(analyzeDobrofsky({ revenue: 10 }).ok, false);
});

test('severe stress does not improve the score', () => {
  const result = compareStress(healthy, { revenuePct: -.2, ebitPct: -.6, operatingCashFlowPct: -.7, interestExpensePct: .5 });
  assert.ok(result.stressed.score >= result.baseline.score);
});
