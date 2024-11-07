import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NotAccessException } from '../exceptions/auth.exeptions';
import { ROLES_KEY } from '../../../common/decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
		if (!roles) return true;

		const { user } = context.switchToHttp().getRequest();

		// Если нет пользователя или прав у него, доступ запрещен
		if (!user || (user.isRoot !== true && !user.roles)) {
			throw new NotAccessException();
		}

		// Проверяем, есть ли у пользователя флаг isRoot
		if (user.isRoot) return true;

		// Извлекаем массив названий ролей пользователя, убирая пробелы
		const userRoleNames = user.roles.map((userRole) => userRole.role.name.trim());

		// Проверяем, есть ли хотя бы одна запрашиваемая роль у пользователя
		const hasRole = roles.some((role) => userRoleNames.includes(role));

		if (!hasRole) throw new NotAccessException();

		return true;
	}
}
