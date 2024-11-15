import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenIsAbsentException } from '../../module/auth/exceptions/auth.exeptions';

export const JwtToken = createParamDecorator((data: string, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	const authHeader = request.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw new TokenIsAbsentException();
	}

	return authHeader.split(' ')[1].trim();
});
