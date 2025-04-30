import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { AuthRepository } from './auth.repository';
import { AttemptService } from './attempt.service';
import { SessionModule } from '../session/session.module';

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
	controllers: [AuthController],
	providers: [AttemptService, AuthService, AuthRepository, ConfigService, AccessTokenStrategy, RefreshTokenStrategy],
	exports: [AttemptService, AuthService, AuthRepository, JwtModule],
})
export class AuthModule {}
