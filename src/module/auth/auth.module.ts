import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { AuthRepository } from './repositories/auth.repository';
import { AttemptService } from './services/attempt.service';
import { SessionModule } from '../session/session.module';
import { TgAuthController } from './controllers/tg-auth.controller';
import { SessionAuthController } from './controllers/session-auth.controller';
import { TgAuthService } from './services/tg-auth.service';
import { SessionAuthService } from './services/session-auth.service';
import { TgAuthRepository } from './repositories/tg-auth.repository';
import { TokenService } from './services/token.service';

@Global()
@Module({
	imports: [
		UserModule,
		SessionModule,
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_ACCESS_SECRET'),
				signOptions: {
					expiresIn: configService.get<string>('JWT_ACCESS_EXPIRED'),
				},
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController, TgAuthController, SessionAuthController],
	providers: [
		AttemptService,
		AuthService,
		AuthRepository,
		ConfigService,
		AccessTokenStrategy,
		RefreshTokenStrategy,
		TgAuthService,
		SessionAuthService,
		TgAuthRepository,
		TokenService
	],
	exports: [
		AttemptService,
		AuthService,
		AuthRepository,
		JwtModule,
		TgAuthService,
		SessionAuthService,
		TokenService
	],
})
export class AuthModule {}
