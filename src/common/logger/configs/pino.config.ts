import * as dayjs from 'dayjs';
import { ELogLevel } from '../enums/log-level.enum';

// текущая дата
const today = dayjs().format('YY-MM-DD');

export const PinoConfig = {
	// дефолтный уровень логирования, ниже которого лог не пишется
	PINO_LOG_LEVEL: ELogLevel.ERROR,

	// кастомные уровни логирования
	PINO_CUSTOM_LEVELS: {
		critical: 70,
		apocalypse: 90,
	},

	// цветной лог
	PINO_COLORIZE: true,

	// режим синхронизации
	PINO_SYNC: true,

	// автоматически создать каталог при его отсутствии
	LOG_MKDIR: true,

	// минимальный размер буффера
	LOG_MIN_LENGTH: 4,

	// ключи-исключения, которые не логируются или скрываются
	REDACT_EXCLUDE: ['hostname', 'password', 'refresh_token'],

	// путь до каталога с логами
	LOG_PATH: './logs',

	// имя файла с логами
	LOG_FILE: today + '.log',
};
