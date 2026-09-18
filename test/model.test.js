import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeDobrofsky } from '../src/engine/dobrofsky/model.js';
import { compareStress } from '../src/engine/risk/stress.js';
import { altmanZ, piotroskiF } from '../src/engine/benchmarks/models.js';
import { analyzeEarningsQuality } from '../src/engine/quality/earnings.js';

const healthy = { revenue:1000,currentAssets:500,currentLiabilities:250,totalAssets:1500,totalDebt:450,totalEquity:1050,ebit:200,interestExpense:40,operatingIncome:200,netIncome:140,operatingCashFlow:180,accountsReceivable:120,inventory:100 };

test('returns an explainable bounded score',()=>{const r=analyzeDobrofsky(healthy);assert.equal(r.ok,true);assert.ok(r.score>=0&&r.score<=100);assert.equal(r.drivers.length,3);assert.equal(r.model.calibrated,false);});
test('rejects incomplete financial statements',()=>assert.equal(analyzeDobrofsky({revenue:10}).ok,false));
test('severe stress does not improve the score',()=>{const r=compareStress(healthy,{revenuePct:-.2,ebitPct:-.6,operatingCashFlowPct:-.7,interestExpensePct:.5});assert.ok(r.stressed.score>=r.baseline.score);});
test('Altman is unavailable rather than inventing missing inputs',()=>assert.equal(altmanZ(healthy).available,false));
test('Altman calculates when required inputs exist',()=>{const r=altmanZ({...healthy,retainedEarnings:600,marketValueEquity:1800,totalLiabilities:450});assert.equal(r.available,true);assert.ok(Number.isFinite(r.score));});
test('Piotroski requires prior period',()=>assert.equal(piotroskiF(healthy).available,false));
test('earnings quality flags cash conversion weakness',()=>{const r=analyzeEarningsQuality([{period:'2025',financials:{...healthy,netIncome:100,operatingCashFlow:120}},{period:'2026',financials:{...healthy,netIncome:150,operatingCashFlow:80}}]);assert.ok(r.alerts.length>0);});
