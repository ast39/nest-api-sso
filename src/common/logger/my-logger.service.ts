import { Injectable, Logger } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class MyLoggerService extends Logger {
	constructor(private readonly myLogger: PinoLogger) {
		super();
	}

	verbose(message: any, context?: string) {
		this.myLogger.trace({ message, context });
	}

	debug(message: any, context?: string) {
		this.myLogger.debug({ message, context });
	}

	log(message: any, context?: string) {
		this.myLogger.info({ message, context });
	}

	warn(message: any, context?: string) {
		this.myLogger.warn({ message, context });
	}

	error(message: any, trace?: string, context?: string) {
		this.myLogger.error({ message, trace, context });
	}

	fatal(message: any, trace?: string, context?: string) {
		this.myLogger.fatal({ message, trace, context });
	}
}
