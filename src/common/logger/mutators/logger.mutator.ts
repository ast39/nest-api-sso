import { IPinoConfig } from '../lib/pino-config.interface';
import { Params } from 'nestjs-pino';

// мутатор для переолпределения типа конфигурации Pino
export const pinoConfigAsParams = (config: IPinoConfig | Params) => {
	return config as Params;
};
