import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { MyLoggerService } from './my-logger.service';
import { pinoConfigAsParams } from './mutators/logger.mutator';
import { LoggerConsoleConfig } from './lib/logger-console.config';

@Module({
	imports: [LoggerModule.forRoot(pinoConfigAsParams(new LoggerConsoleConfig().getConfig()))],
	providers: [MyLoggerService],
	exports: [MyLoggerService],
})
export class MyLoggerModule {}
