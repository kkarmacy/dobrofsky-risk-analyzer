import test from 'node:test';
import assert from 'node:assert/strict';
import { FEATURES, PLANS, getEntitlements, hasEntitlement } from '../src/platform/entitlements.js';
import { AI_GUARDRAILS, buildAIAnalysisContext, validateAIRequest } from '../src/platform/ai/contract.js';
import { addWorkspaceMember, canAccessWorkspace, createWorkspace, getWorkspacePermissions, WORKSPACE_ROLES } from '../src/platform/workspaces.js';
import { appendAuditEvent, createAuditEvent, getAuditEvents } from '../src/platform/audit.js';

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

test('workspace owner can manage members and analyst can write analyses', () => {
  const workspace=createWorkspace({id:'ws-1',name:'Research Team',ownerId:'user-1'});
  const withAnalyst=addWorkspaceMember(workspace,{userId:'user-2',role:WORKSPACE_ROLES.analyst});
  assert.equal(canAccessWorkspace(withAnalyst,'user-1','members:manage'),true);
  assert.equal(canAccessWorkspace(withAnalyst,'user-2','analysis:write'),true);
  assert.equal(canAccessWorkspace(withAnalyst,'user-2','members:manage'),false);
  assert.equal(canAccessWorkspace(withAnalyst,'user-3','analysis:read'),false);
});

test('workspace rejects duplicate members and invalid owner role assignment', () => {
  const workspace=createWorkspace({id:'ws-1',name:'Research Team',ownerId:'user-1'});
  assert.throws(()=>addWorkspaceMember(workspace,{userId:'user-1',role:WORKSPACE_ROLES.viewer}),/already a workspace member/);
  assert.throws(()=>addWorkspaceMember(workspace,{userId:'user-2',role:WORKSPACE_ROLES.owner}),/non-owner/);
  assert.deepEqual(getWorkspacePermissions('unknown'),[]);
});

test('audit events are validated, immutable, and append-only by unique id', () => {
  const first=createAuditEvent({id:'evt-1',actorId:'user-1',action:'analysis.created',resourceType:'analysis',resourceId:'a-1',occurredAt:'2026-11-13T10:00:00.000Z',metadata:{modelVersion:'0.1-research'}});
  const history=appendAuditEvent([],first);
  assert.equal(Object.isFrozen(history),true);
  assert.equal(Object.isFrozen(history[0].metadata),true);
  assert.throws(()=>appendAuditEvent(history,first),/unique/);
  assert.throws(()=>createAuditEvent({id:'bad'}),/actorId is required/);
  assert.equal(getAuditEvents(history,{resourceType:'analysis'}).length,1);
});
