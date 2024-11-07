import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus();
		const mes: any = exception.getResponse();
		const result = {};
		if (Array.isArray(mes)) {
			mes.forEach((obj) => {
				Object.assign(result, obj);
			});
		}
		response.status(status).json(Object.keys(result).length > 0 ? result : mes);
	}
}

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter<BadRequestException> {
	public catch(exception, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		response.status(422).json({
			statusCode: 422,
			error: `Unprocessable Entity`,
			message: exception.message.message,
		});
	}
}
