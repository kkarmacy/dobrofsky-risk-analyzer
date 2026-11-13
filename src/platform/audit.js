const REQUIRED_FIELDS = ['id', 'actorId', 'action', 'resourceType', 'resourceId', 'occurredAt'];

export function createAuditEvent(event) {
  if (!event || typeof event !== 'object' || Array.isArray(event)) {
    throw new Error('Audit event must be an object.');
  }
  for (const field of REQUIRED_FIELDS) {
    if (typeof event[field] !== 'string' || event[field].trim().length === 0) {
      throw new Error(`Audit event ${field} is required.`);
    }
  }
  if (Number.isNaN(Date.parse(event.occurredAt))) throw new Error('Audit event occurredAt must be a valid date.');
  if (event.metadata !== undefined && (event.metadata === null || typeof event.metadata !== 'object' || Array.isArray(event.metadata))) {
    throw new Error('Audit event metadata must be an object when provided.');
  }
  return deepFreeze({
    ...event,
    id: event.id.trim(),
    actorId: event.actorId.trim(),
    action: event.action.trim(),
    resourceType: event.resourceType.trim(),
    resourceId: event.resourceId.trim(),
    metadata: event.metadata ? structuredClone(event.metadata) : {}
  });
}

export function appendAuditEvent(events, event) {
  if (!Array.isArray(events)) throw new Error('Audit event history must be an array.');
  const nextEvent = createAuditEvent(event);
  if (events.some(existing => existing.id === nextEvent.id)) throw new Error('Audit event id must be unique.');
  return Object.freeze([...events, nextEvent]);
}

export function getAuditEvents(events, { resourceType, resourceId, actorId } = {}) {
  if (!Array.isArray(events)) return [];
  return events.filter(event =>
    (!resourceType || event.resourceType === resourceType) &&
    (!resourceId || event.resourceId === resourceId) &&
    (!actorId || event.actorId === actorId)
  );
}

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}
