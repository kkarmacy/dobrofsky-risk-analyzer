export const PLANS = Object.freeze({
  community: 'community',
  professional: 'professional',
  consulting: 'consulting',
  enterprise: 'enterprise'
});

export const FEATURES = Object.freeze({
  coreAnalysis: 'coreAnalysis',
  basicStressTesting: 'basicStressTesting',
  aiAnalyst: 'aiAnalyst',
  advancedScenarios: 'advancedScenarios',
  reportGeneration: 'reportGeneration',
  savedAnalyses: 'savedAnalyses',
  consultingReview: 'consultingReview',
  portfolioMonitoring: 'portfolioMonitoring',
  teamWorkspace: 'teamWorkspace',
  apiAccess: 'apiAccess'
});

const grants = Object.freeze({
  [PLANS.community]: [
    FEATURES.coreAnalysis,
    FEATURES.basicStressTesting
  ],
  [PLANS.professional]: [
    FEATURES.coreAnalysis,
    FEATURES.basicStressTesting,
    FEATURES.aiAnalyst,
    FEATURES.advancedScenarios,
    FEATURES.reportGeneration,
    FEATURES.savedAnalyses
  ],
  [PLANS.consulting]: [
    FEATURES.coreAnalysis,
    FEATURES.basicStressTesting,
    FEATURES.aiAnalyst,
    FEATURES.advancedScenarios,
    FEATURES.reportGeneration,
    FEATURES.savedAnalyses,
    FEATURES.consultingReview
  ],
  [PLANS.enterprise]: Object.values(FEATURES)
});

export function hasEntitlement(plan, feature) {
  return Boolean(grants[plan]?.includes(feature));
}

export function getEntitlements(plan) {
  return [...(grants[plan] ?? [])];
}
