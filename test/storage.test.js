import test from 'node:test';
import assert from 'node:assert/strict';
import { createMemoryAnalysisStore } from '../src/platform/storage/analysis-store.js';

const record = {
  id: 'analysis-1',
  company: 'Example Company',
  periods: [{ period: '2026', financials: { revenue: 1000, totalAssets: 1500 } }]
};

test('analysis store saves, retrieves, lists, and deletes a record', async () => {
  const store = createMemoryAnalysisStore();
  const saved = await store.save(record);
  assert.equal(saved.id, record.id);
  assert.equal((await store.get(record.id)).company, 'Example Company');
  assert.equal((await store.list()).length, 1);
  await store.remove(record.id);
  assert.equal(await store.get(record.id), undefined);
});

test('analysis store validates required fields before saving', async () => {
  const store = createMemoryAnalysisStore();
  await assert.rejects(store.save({ id: 'missing-company', periods: record.periods }), /Company name is required/);
  await assert.rejects(store.save({ ...record, periods: [] }), /At least one financial period is required/);
});

test('stored records are copied to prevent external mutation', async () => {
  const store = createMemoryAnalysisStore();
  await store.save(record);
  const loaded = await store.get(record.id);
  loaded.periods[0].financials.revenue = 1;
  assert.equal((await store.get(record.id)).periods[0].financials.revenue, 1000);
});
