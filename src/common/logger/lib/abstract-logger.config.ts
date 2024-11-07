import { IPinoConfig } from './pino-config.interface';

// абстрактный класс для различных конфигов логирования
export abstract class AbstractLoggerConfig {
	// вычленить query параметры из URL
	parseUrl(url: string) {
		const regex = /[?&]([^=#]+)=([^&#]*)/g;
		const params = {};

		let match: string[];
		while ((match = regex.exec(url))) {
			params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
		}

		return params;
	}

	abstract getConfig(): IPinoConfig;
}
