import pino from 'pino';
import { PinoConfig } from '../configs/pino.config';
import { consoleTransport } from '../configs/transport.config';
import { IncomingMessage, ServerResponse } from 'http';
import { AbstractLoggerConfig } from './abstract-logger.config';
import { IPinoConfig } from './pino-config.interface';

// конфиг для логирования в консоль (для дэва)
export class LoggerConsoleConfig extends AbstractLoggerConfig {
	public getConfig(): IPinoConfig {
		return {
			forRoutes: ['*'],
			exclude: [],
			pinoHttp: {
				// статус логирования
				enabled: true,

				// формат даты в логах
				timestamp: pino.stdTimeFunctions.isoTime,

				// минимальный уровень критичности лога, с которого лог будет работать
				level: PinoConfig.PINO_LOG_LEVEL,

				// кастомные уровни критичности
				customLevels: PinoConfig.PINO_CUSTOM_LEVELS,

				// форматирование данных конфига
				formatters: {
					level: (label: string) => {
						return { level: label.toUpperCase() };
					},
				},

				// ключи-исключения для логирования
				redact: {
					paths: PinoConfig.REDACT_EXCLUDE,
					censor: '******',
					remove: false,
				},

				// сериализация данных
				serializers: {
					req: (request: IncomingMessage) => ({
						method: request.method,
						url: request.url,
						headers: {
							'host': request.headers.host,
							'user-agent': request.headers['user-agent'],
						},
						body: request['raw']['body'],
					}),
					res: (reply: ServerResponse) => ({
						statusCode: reply.statusCode,
					}),
					err: (err: any) => ({
						err,
					}),
				},

				// транспорт для логирования
				transport: consoleTransport,
			},
		};
	}
}
