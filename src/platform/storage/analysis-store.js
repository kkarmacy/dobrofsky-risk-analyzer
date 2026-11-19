const DATABASE_NAME = 'dobrofsky-risk-analyzer';
const DATABASE_VERSION = 1;
const STORE_NAME = 'analyses';

function validateRecord(record) {
  if (!record || typeof record !== 'object') throw new Error('Analysis record must be an object.');
  if (typeof record.id !== 'string' || !record.id.trim()) throw new Error('Analysis id is required.');
  if (typeof record.company !== 'string' || !record.company.trim()) throw new Error('Company name is required.');
  if (!Array.isArray(record.periods) || record.periods.length === 0) throw new Error('At least one financial period is required.');
  if (!record.periods.every(period => period && typeof period.period === 'string' && period.financials && typeof period.financials === 'object')) {
    throw new Error('Every period must include a period label and financial data.');
  }
  return {
    ...record,
    id: record.id.trim(),
    company: record.company.trim(),
    updatedAt: new Date().toISOString()
  };
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed.'));
  });
}

export function createIndexedDBAnalysisStore(indexedDB = globalThis.indexedDB) {
  if (!indexedDB) throw new Error('IndexedDB is not available in this environment.');
  let databasePromise;
  const database = () => {
    if (!databasePromise) {
      databasePromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            store.createIndex('updatedAt', 'updatedAt');
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('Unable to open local analysis database.'));
        request.onblocked = () => reject(new Error('Local analysis database upgrade is blocked by another open tab.'));
      });
    }
    return databasePromise;
  };

  return Object.freeze({
    async save(record) {
      const value = validateRecord(record);
      const db = await database();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).put(value);
      await new Promise((resolve, reject) => {
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error ?? new Error('Unable to save analysis.'));
        transaction.onabort = () => reject(transaction.error ?? new Error('Analysis save was aborted.'));
      });
      return value;
    },
    async get(id) {
      const db = await database();
      return requestResult(db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(id));
    },
    async list() {
      const db = await database();
      const records = await requestResult(db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll());
      return records.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    },
    async remove(id) {
      const db = await database();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).delete(id);
      await new Promise((resolve, reject) => {
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error ?? new Error('Unable to delete analysis.'));
        transaction.onabort = () => reject(transaction.error ?? new Error('Analysis deletion was aborted.'));
      });
    }
  });
}

export function createMemoryAnalysisStore() {
  const records = new Map();
  return Object.freeze({
    async save(record) {
      const value = validateRecord(record);
      records.set(value.id, structuredClone(value));
      return structuredClone(value);
    },
    async get(id) {
      const value = records.get(id);
      return value ? structuredClone(value) : undefined;
    },
    async list() {
      return [...records.values()].map(value => structuredClone(value)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    },
    async remove(id) {
      records.delete(id);
    }
  });
}
