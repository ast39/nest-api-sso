import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RoleGuard } from '../../module/auth/guards/role-guard';

export const ROLES_KEY = 'roles';

export function Roles(...roles: string[]) {
	// Проверяем, является ли первый аргумент строкой с запятыми, и разбиваем её на массив
	const roleArray =
		roles.length === 1 && roles[0].includes(',') ? roles[0].split(',').map((role) => role.trim()) : roles;

	return applyDecorators(SetMetadata(ROLES_KEY, roleArray), UseGuards(RoleGuard));
}
