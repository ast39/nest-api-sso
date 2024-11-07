import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Bearer = createParamDecorator((data: string, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return request.headers['authorization'];
});
