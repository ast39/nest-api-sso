import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../users/user.service';
import {
	TokenExpireException,
} from '../exceptions/auth.exeptions';
import { TokenDataDto } from '../dto/token-data.dto';
import { UserDto } from '../../users/dto/user.dto';
import { SessionService } from '../../session/session.service';
import { ValidateResponseDto } from '../dto/validate-response.dto';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class TokenService {
	protected readonly logger = new Logger(TokenService.name);

	constructor(
		protected jwtService: JwtService,
		protected configService: ConfigService,
		protected userService: UserService,
		protected sessionService: SessionService,
		protected authRepo: AuthRepository,
	) {}

	// Сгенерировать токены
	protected async generateToken(user: TokenDataDto, sessionId: string): Promise<string> {
		const payload = {
			id: user.id,
			login: user.login,
			name: user.name,
			department: user.department,
			position: user.position,
			email: user.email,
			phone: user.phone,
			telegramId: user.telegramId,
			roles: user.roles,
			isRoot: user.isRoot,
			sessionId,
		};
		return this.jwtService.signAsync(payload, {
			secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
			expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRED'),
		});
	}

	// Валидация токена
	async validateToken(token: string): Promise<UserDto> {
		try {
			// Проверяем, не заблокирован ли токен
			const isBlocked = await this.authRepo.check(token);
			if (isBlocked) {
				this.logger.debug(`Exception: Token is blocked`);
				throw new TokenExpireException();
			}
			
			// Верифицируем токен
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
			});

			// Если токен валиден, проверяем существование сессии
			if (payload && payload['sessionId']) {
				const session = await this.sessionService.getSession(payload['sessionId']);
				if (!session) {
					this.logger.debug(`Exception: Session not found during token validation ${payload['sessionId']}`);
					throw new TokenExpireException();
				}

				// Получаем полную информацию о пользователе
				const user = await this.userService.getUserById(payload.id);
				if (!user) {
					throw new TokenExpireException();
				}

				return {
					...user,
					sessionId: payload.sessionId,
				} as ValidateResponseDto;
			}
		} catch (error) {
			this.logger.debug(`Exception: Token validation failed [${error.message}]`);
			throw new TokenExpireException();
		}
	}
}
