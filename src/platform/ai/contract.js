const allowedSections = new Set([
  'summary',
  'riskDrivers',
  'earlyWarnings',
  'stressScenarios',
  'earningsQuality',
  'benchmarks'
]);

export function buildAIAnalysisContext({ company, period, analysis, history, earnings, benchmarks }) {
  if (!analysis?.ok) throw new Error('A valid deterministic analysis is required before AI interpretation.');

  return Object.freeze({
    company,
    period,
    model: analysis.model,
    score: analysis.score,
    classification: analysis.classification,
    components: analysis.components,
    drivers: analysis.drivers,
    ratios: analysis.ratios,
    historicalAlerts: history?.alerts ?? [],
    earningsQualityAlerts: earnings?.alerts ?? [],
    benchmarks: benchmarks ?? {}
  });
}

export function validateAIRequest(request) {
  if (!request || typeof request !== 'object') return { ok: false, errors: ['Request must be an object.'] };

  const errors = [];
  if (typeof request.question !== 'string' || request.question.trim().length < 3) {
    errors.push('A question of at least 3 characters is required.');
  }

  if (request.sections && (!Array.isArray(request.sections) || request.sections.some(section => !allowedSections.has(section)))) {
    errors.push('One or more requested analysis sections are unsupported.');
  }

  return { ok: errors.length === 0, errors };
}

export const AI_GUARDRAILS = Object.freeze([
  'Never invent or modify financial inputs.',
  'Never calculate or overwrite the Dobrofsky score.',
  'Treat deterministic engine outputs as authoritative model outputs.',
  'State when requested evidence is missing.',
  'Separate observed data, deterministic outputs, scenarios, and AI interpretation.',
  'Do not describe the score as a bankruptcy probability without validated calibration.'
]);
