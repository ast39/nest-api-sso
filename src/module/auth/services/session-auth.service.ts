import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../../users/user.service';
import {
	TokenExpireException,
} from '../exceptions/auth.exeptions';
import { AuthDataDto } from '../dto/auth-data.dto';
import { DefaultResponse } from '../../../common/dto/default.response.dto';
import { SessionService } from '../../session/session.service';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class SessionAuthService extends TokenService {
	protected readonly logger = new Logger(SessionAuthService.name);

	constructor(
		protected userService: UserService,
		protected sessionService: SessionService,
		jwtService: JwtService,
		configService: ConfigService,
		authRepo: AuthRepository,
	) {
		super(jwtService, configService, userService, sessionService, authRepo);
	}

	// Silent login - получение токенов по сессии
	async signInBySession(sessionId: string): Promise<AuthDataDto> {
		this.logger.debug(`Notice: SignIn by session`);

		// Если сессии нет
		const session = await this.sessionService.getSession(sessionId);
		if (!session) {
			this.logger.debug(`Exception: Session not found [${sessionId}]`);
			throw new TokenExpireException();
		}

		// Если пользователя нет
		const user = await this.userService.getUserById(+session.userId);
		if (!user) {
			this.logger.debug(`Exception: User not found [${session.userId}]`);
			throw new TokenExpireException();
		}

		// Генерируем новый токен
		const token = await this.generateToken(user, sessionId);

		return {
			accessToken: token,
			roles: user.roles,
			isRoot: user.isRoot,
			sessionId,
		} as AuthDataDto;
	}

	// Обновление сессии
	async refreshUserSession(sessionId: string): Promise<DefaultResponse> {
		this.logger.debug(`Notice: Refresh session`);

		// Проверяем сессию
		const session = await this.sessionService.getSession(sessionId);
		if (!session) {
			this.logger.debug(`Exception: Session not found [${sessionId}]`);
			throw new TokenExpireException();
		}

		// Обновляем сессию
		await this.sessionService.refreshSession(sessionId);
		this.logger.debug(`Notice: Session refreshed [${sessionId}]`);

		return { success: true };
	}
}
