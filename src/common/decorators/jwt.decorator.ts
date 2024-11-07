import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JwtToken = createParamDecorator((data: string, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();

	return request.headers.authorization.split(' ')[1].trim();
});
