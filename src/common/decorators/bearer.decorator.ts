import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenIsAbsentException } from 'src/module/auth/exceptions/auth.exeptions';

export const Bearer = createParamDecorator((data: string, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	const authHeader = request.headers['authorization'];
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw new TokenIsAbsentException();
	}
	return authHeader.split(' ')[1].trim();
});
