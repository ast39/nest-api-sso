import { RequestMethod } from '@nestjs/common';
import { ELogLevel } from '../enums/log-level.enum';

export interface IPinoConfig {
	forRoutes: any[];
	exclude: { method: RequestMethod; path: string }[];
	pinoHttp: {
		enabled: boolean;
		timestamp: () => string;
		level: ELogLevel;
		customLevels?: object;
		formatters?: any;
		redact: { paths: string[]; censor: string; remove: boolean };
		serializers: object;
		transport: any;
	};
}
