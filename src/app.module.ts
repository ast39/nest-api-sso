import { Module } from '@nestjs/common';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma';
import { RoleModule } from './module/role/role.module';
import { UserModule } from './module/users/user.module';
import { AuthModule } from './module/auth/auth.module';
import { RedisModule } from './module/redis/redis.module';
import { SessionModule } from './module/session/session.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: join('.env'),
		}),
		PrismaModule,
		AuthModule,
		RoleModule,
		UserModule,
		RedisModule,
		SessionModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
