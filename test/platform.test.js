import test from 'node:test';
import assert from 'node:assert/strict';
import { FEATURES, PLANS, getEntitlements, hasEntitlement } from '../src/platform/entitlements.js';
import { AI_GUARDRAILS, buildAIAnalysisContext, validateAIRequest } from '../src/platform/ai/contract.js';

test('community plan exposes only core analysis capabilities', () => {
  assert.equal(hasEntitlement(PLANS.community, FEATURES.coreAnalysis), true);
  assert.equal(hasEntitlement(PLANS.community, FEATURES.aiAnalyst), false);
  assert.equal(hasEntitlement(PLANS.community, FEATURES.apiAccess), false);
});

test('professional unlocks AI without consulting or enterprise permissions', () => {
  assert.equal(hasEntitlement(PLANS.professional, FEATURES.aiAnalyst), true);
  assert.equal(hasEntitlement(PLANS.professional, FEATURES.consultingReview), false);
  assert.equal(hasEntitlement(PLANS.professional, FEATURES.portfolioMonitoring), false);
});

test('enterprise receives every registered feature', () => {
  assert.deepEqual(new Set(getEntitlements(PLANS.enterprise)), new Set(Object.values(FEATURES)));
});

test('AI context accepts deterministic analysis and preserves model output', () => {
  const analysis={ok:true,score:71,classification:'high',components:{solvency:80},drivers:[{factor:'solvency',risk:80}],ratios:{debtToAssets:0.8},model:{name:'Dobrofsky Risk Model',version:'0.1-research',calibrated:false}};
  const context=buildAIAnalysisContext({company:'Test Co',period:'2026',analysis});
  assert.equal(context.score,71);
  assert.equal(context.model.calibrated,false);
  assert.throws(()=>{context.score=10;});
});

test('AI requests reject unsupported sections and empty questions', () => {
  assert.equal(validateAIRequest({question:'Why did risk rise?',sections:['riskDrivers']}).ok,true);
  const invalid=validateAIRequest({question:'',sections:['bankruptcyPrediction']});
  assert.equal(invalid.ok,false);
  assert.equal(invalid.errors.length,2);
});

test('AI guardrails prohibit score mutation and unsupported probability claims', () => {
  assert.ok(AI_GUARDRAILS.some(rule=>rule.includes('Never calculate or overwrite')));
  assert.ok(AI_GUARDRAILS.some(rule=>rule.includes('bankruptcy probability')));
});
