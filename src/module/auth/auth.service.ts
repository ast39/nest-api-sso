import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/user.service';
import {
	BruteForceException,
	TokenExpireException,
	UserWasBlockedException,
	WrongAuthDataException,
} from './exceptions/auth.exeptions';
import * as bcrypt from 'bcryptjs';
import { TokenDataDto } from './dto/token-data.dto';
import { AuthDataDto } from './dto/auth-data.dto';
import { AuthRepository } from './auth.repository';
import { UserDto } from '../users/dto/user.dto';
import { IUser } from '../users/interfaces/user.prisma.interface';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { AttemptService } from './attempt.service';
import { SessionService } from '../session/session.service';
import { DeviceInfoDto } from '../session/dto/device-info.dto';
import { ValidateResponseDto } from './dto/validate-response.dto';
import { LoginByPasswordDto } from './dto/login-by-password.dto';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private authRepo: AuthRepository,
		private attemptService: AttemptService,
		private jwtService: JwtService,
		private configService: ConfigService,
		private userService: UserService,
		private sessionService: SessionService,
	) {}

	// Авторизация по логину и паролю
	async signInByPassword(login: LoginByPasswordDto): Promise<AuthDataDto> {
		this.logger.debug(`Notice: SignIn by password`);

		// Проверяем, не заблокирован ли пользователь по попыткам входа
		if (this.attemptService.isBlocked(login.login)) {
			throw new BruteForceException();
		}

		// получим юзера по ID
		const user = await this.userService.getUserByLogin(login.login);
		if (!user) {
			throw new WrongAuthDataException();
		}

		// Проверим пароль
		const passwordEquals = await bcrypt.compare(login.password, user.password);
		if (!passwordEquals) {
			this.attemptService.recordAttempt(login.login);
			throw new WrongAuthDataException();
		}

		// Проверим, что юзер не заблокирован
		if (user.isBlocked) {
			throw new UserWasBlockedException();
		}

		const userDto = new UserDto(user as IUser);

		// Если авторизация прошла успешно, сбрасываем счетчик попыток
		this.attemptService.resetAttempts(login.login);

		// Создадим сессию
		const sessionId = await this.sessionService.createSession(
			user.id.toString(),
			userDto.roles.map(role => role.name),
			login.device
		);
		this.logger.debug(`Notice: Session created [${sessionId}] for user [${user.id}]`);

		// Создадим на него токен
		const token = await this.generateToken(user, sessionId);

		return {
			accessToken: token,
			roles: userDto.roles,
			isRoot: user.isRoot,
			sessionId,
		} as AuthDataDto;
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

	// Логаут
	public async logout(userId: number, token: string): Promise<DefaultResponse> {
		this.logger.debug(`Notice: Logout`);

		// Заблокируем текущий токен
		const alreadyBlocked = await this.authRepo.check(token);
		if (!alreadyBlocked) {
			await this.authRepo.store(token);
		}

		// Удаляем сессию
		const payload = this.jwtService.decode(token);
		if (payload && payload['sessionId']) {
			await this.sessionService.deleteSession(payload['sessionId']);
			this.logger.debug(`Notice: Session deleted [${payload['sessionId']}] for user [${userId}]`);
		}

		return { success: true };
	}

	// Глобальный логаут - удаление всех сессий пользователя
	async globalLogout(userId: number): Promise<DefaultResponse> {
		this.logger.debug(`Notice: Global logout`);
		
		// Получаем все сессии пользователя
		const sessions = await this.sessionService.getUserSessions(userId.toString());
		
		// Удаляем все сессии
		await this.sessionService.deleteAllUserSessions(userId.toString());
		
		this.logger.debug(`Deleted ${sessions.length} sessions for user ${userId}`);
		
		return { success: true };
	}

	// Сгенерировать токены
	private async generateToken(user: TokenDataDto, sessionId: string): Promise<string> {
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
