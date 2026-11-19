export const WORKSPACE_ROLES = Object.freeze({
  owner: 'owner',
  admin: 'admin',
  analyst: 'analyst',
  viewer: 'viewer'
});

const permissions = Object.freeze({
  [WORKSPACE_ROLES.owner]: ['workspace:read', 'workspace:update', 'members:manage', 'analysis:read', 'analysis:write', 'reports:read', 'reports:write', 'audit:read'],
  [WORKSPACE_ROLES.admin]: ['workspace:read', 'workspace:update', 'members:manage', 'analysis:read', 'analysis:write', 'reports:read', 'reports:write', 'audit:read'],
  [WORKSPACE_ROLES.analyst]: ['workspace:read', 'analysis:read', 'analysis:write', 'reports:read', 'reports:write'],
  [WORKSPACE_ROLES.viewer]: ['workspace:read', 'analysis:read', 'reports:read']
});

export function createWorkspace({ id, name, ownerId, createdAt = new Date().toISOString() }) {
  for (const [field, value] of Object.entries({ id, name, ownerId })) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`Workspace ${field} is required.`);
    }
  }
  if (Number.isNaN(Date.parse(createdAt))) throw new Error('Workspace createdAt must be a valid date.');
  return Object.freeze({
    id: id.trim(),
    name: name.trim(),
    createdAt,
    members: Object.freeze([{ userId: ownerId.trim(), role: WORKSPACE_ROLES.owner }])
  });
}

export function addWorkspaceMember(workspace, { userId, role }) {
  if (!workspace?.id || !Array.isArray(workspace.members)) throw new Error('A valid workspace is required.');
  if (typeof userId !== 'string' || !userId.trim()) throw new Error('Member userId is required.');
  if (!Object.values(WORKSPACE_ROLES).includes(role) || role === WORKSPACE_ROLES.owner) {
    throw new Error('A valid non-owner workspace role is required.');
  }
  if (workspace.members.some(member => member.userId === userId.trim())) {
    throw new Error('User is already a workspace member.');
  }
  return Object.freeze({
    ...workspace,
    members: Object.freeze([...workspace.members, Object.freeze({ userId: userId.trim(), role })])
  });
}

export function canAccessWorkspace(workspace, userId, permission) {
  if (!workspace?.members || typeof userId !== 'string') return false;
  const member = workspace.members.find(entry => entry.userId === userId);
  return Boolean(member && permissions[member.role]?.includes(permission));
}

export function getWorkspacePermissions(role) {
  return [...(permissions[role] ?? [])];
}
