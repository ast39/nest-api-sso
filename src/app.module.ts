import { Module } from '@nestjs/common';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma';
import { RoleModule } from './module/role/role.module';
import { UserModule } from './module/users/user.module';
import { AuthModule } from './module/auth/auth.module';
import { MyLoggerModule } from './common/logger/my-logger.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: join('.env'),
		}),
		PrismaModule,
		MyLoggerModule,
		AuthModule,
		RoleModule,
		UserModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
