import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MyLoggerService } from '../logger/my-logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	constructor(private readonly logger: MyLoggerService) {}

	use(req: Request, res: Response, next: NextFunction): void {
		const { method, url } = req;
		const now = Date.now();

		res.on('finish', () => {
			const responseTime = Date.now() - now;
			const { statusCode } = res;
			this.logger.log(
				{
					method,
					url,
					statusCode,
					responseTime,
				},
				'Request completed',
			);
		});

		next();
	}
}
