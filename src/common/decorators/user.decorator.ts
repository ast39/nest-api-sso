import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenIsAbsentException } from '../../module/auth/exceptions/auth.exeptions';

export const JwtUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	const authHeader = request.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw new TokenIsAbsentException();
	}

	const token = authHeader.split(' ')[1].trim();
	const jwtService = new JwtService();
	const payload = jwtService.decode(token);

	return data ? payload?.[data] : payload;
});
