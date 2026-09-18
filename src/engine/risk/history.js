import { analyzeDobrofsky } from '../dobrofsky/model.js';

export function analyzeHistory(periods) {
  const series = periods.map(({ period, financials }) => ({ period, ...analyzeDobrofsky(financials) }));
  const valid = series.filter(x => x.ok);
  const latest = valid.at(-1);
  const previous = valid.at(-2);
  const change = latest && previous ? latest.score - previous.score : null;
  const alerts = [];
  if (change != null && change >= 10) alerts.push(`Risk score increased ${change} points versus the previous period.`);
  if (valid.length >= 3 && valid.slice(-3).every((x,i,a) => i === 0 || x.score > a[i-1].score)) alerts.push('Risk score has deteriorated for three consecutive periods.');
  return { series, latest, change, alerts };
}
