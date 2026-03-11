import { ROLES, type Role } from '@/constants/roles';

export type RolesInput = Role[] | string[] | string | null | undefined;

export const normalizeRoles = (roles: RolesInput): Role[] => {
	if (!roles) {
		return [];
	}

	if (Array.isArray(roles)) {
		return roles.filter((role): role is Role => typeof role === 'string') as Role[];
	}

	return typeof roles === 'string' ? [roles as Role] : [];
};

export const hasAnyRole = (
	roles: RolesInput,
	requiredRoles: readonly Role[]
): boolean => {
	const normalizedRoles = normalizeRoles(roles);
	return requiredRoles.some((role) => normalizedRoles.includes(role));
};

export const isAdmin = (roles: RolesInput): boolean =>
	hasAnyRole(roles, [ROLES.ADMIN]);

export const canManageUsers = (roles: RolesInput): boolean =>
	isAdmin(roles);

export const canManagePosts = (roles: RolesInput): boolean =>
	hasAnyRole(roles, [ROLES.ADMIN, ROLES.MODERATOR]);
