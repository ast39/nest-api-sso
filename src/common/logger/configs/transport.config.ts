import { PinoConfig } from './pino.config';
import { TransportTargetOptions } from 'pino';
import * as crypto from 'crypto';

// uuid запроса
const uuid = crypto.randomUUID();

// транспорт логирования в файл
export const fileTransport: TransportTargetOptions = {
	target: 'pino/file',
	options: {
		genReqId: uuid,
		autoLogging: true,
		destination: PinoConfig.LOG_PATH + '/' + PinoConfig.LOG_FILE,
		mkdir: PinoConfig.LOG_MKDIR,
		sync: PinoConfig.PINO_SYNC,
		minLength: PinoConfig.LOG_MIN_LENGTH,
		translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
		ignore: 'pid,hostname',
	},
};

// транспорт логирования в консоль
export const consoleTransport: TransportTargetOptions = {
	target: 'pino-pretty',
	options: {
		genReqId: uuid,
		autoLogging: true,
		colorize: PinoConfig.PINO_COLORIZE,
		sync: PinoConfig.PINO_SYNC,
		translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
	},
};
