import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
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
import { RefreshDto } from './dto/refresh.dto';
import { UserDto } from '../users/dto/user.dto';
import { IUser } from '../users/interfaces/user.prisma.interface';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { AttemptService } from './attempt.service';

@Injectable()
export class AuthService {
	constructor(
		private authRepo: AuthRepository,
		private attemptService: AttemptService,
		private jwtService: JwtService,
		private configService: ConfigService,
		private userService: UserService,
	) {}

	// Авторизация по логину и паролю
	async signIn(login: LoginDto): Promise<AuthDataDto> {
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

		// Создадим на него токены
		const tokens = await this.generateTokens(user);

		// Обновим refresh токен в БД
		await this.updateRefreshToken(user.id, tokens.refresh_token);

		return {
			accessToken: tokens.access_token,
			refreshToken: tokens.refresh_token,
			roles: userDto.roles,
			isRoot: user.isRoot,
		} as AuthDataDto;
	}

	// Пролонгирование токена
	async refreshTokens(refreshData: RefreshDto) {
		const { refreshToken } = refreshData;
		const jwtService = new JwtService();
		const payload = jwtService.decode(refreshToken);
		if (!payload) {
			throw new TokenExpireException();
		}
		const userId = payload?.['id'];

		// Получим пользователя из БД и проверяем наличие refresh токена
		const user = await this.userService.getUserByIdVsRefresh(+userId);
		if (!user || !user.refreshToken) {
			throw new TokenExpireException();
		}

		// Сверяем refresh токен в БД с тем что нам пришел
		const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
		if (!refreshTokenMatches) {
			throw new TokenExpireException();
		}

		// Генерируем новые токены и обновляем refresh токен в БД
		const tokens = await this.generateTokens(user);
		await this.updateRefreshToken(user.id, tokens.refresh_token);

		return tokens;
	}

	// Логаут
	public async logout(userId: number, token: string): Promise<DefaultResponse> {
		// Заблокируем текущий токен
		const alreadyBlocked = await this.authRepo.check(token);
		if (!alreadyBlocked) {
			await this.authRepo.store(token);
		}

		// Отзовем refresh токен
		await this.userService.updateUser(userId, {
			refreshToken: null,
		});

		return { success: true };
	}

	// Сгенерировать токены
	private async generateTokens(user: TokenDataDto) {
		const payload = {
			id: user.id,
			login: user.login,
			name: user.name,
			position: user.position,
			roles: user.roles,
			isRoot: user.isRoot,
		};
		const [access_token, refresh_token] = await Promise.all([
			this.jwtService.signAsync(payload, {
				secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
				expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRED'),
			}),
			this.jwtService.signAsync(payload, {
				secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
				expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRED'),
			}),
		]);

		return {
			access_token,
			refresh_token,
		};
	}

	// Обновление рефреш токена в БД
	private async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
		const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

		await this.userService.updateUser(userId, {
			refreshToken: hashedRefreshToken,
		});
	}
}
