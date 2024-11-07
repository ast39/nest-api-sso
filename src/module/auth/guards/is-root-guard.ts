import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NotAccessException } from '../exceptions/auth.exeptions';

@Injectable()
export class IsRootGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		const user = request.user;

		// Проверяем, есть ли у пользователя флаг isRoot
		if (user && user.isRoot) {
			return true;
		}

		// Если пользователь не root, выбрасываем ошибку 403
		throw new NotAccessException();
	}
}
