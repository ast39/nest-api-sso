import pino from 'pino';
import { PinoConfig } from '../configs/pino.config';
import { fileTransport } from '../configs/transport.config';
import { IncomingMessage, ServerResponse } from 'http';
import { AbstractLoggerConfig } from './abstract-logger.config';
import { RequestMethod } from '@nestjs/common';
import { IPinoConfig } from './pino-config.interface';

// конфиг для логирования в файлы (для прода)
export class LoggerFileConfig extends AbstractLoggerConfig {
	getConfig(): IPinoConfig {
		return {
			forRoutes: ['*'],
			exclude: [{ method: RequestMethod.ALL, path: '*' }],
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
						url: request.url.replace(/\?.*$/, ''),
						params: this.parseUrl(request.url),
						headers: {
							'host': request.headers.host,
							'user-agent': request.headers['user-agent'],
						},
						body: request['raw']['body'],
					}),
					res: (reply: ServerResponse) => ({
						statusCode: reply.statusCode,
						statusMessage: reply.statusMessage,
					}),
					err: (err: any) => ({
						err,
					}),
				},

				// транспорт для логирования
				transport: fileTransport,
			},
		};
	}
}
