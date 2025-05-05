import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Headers } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IJwtToken } from '../../common/interfaces/jwt.interface';
import { UserDto } from '../users/dto/user.dto';
import { JwtUser } from '../../common/decorators/user.decorator';
import { UserService } from '../users/user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtToken } from '../../common/decorators/jwt.decorator';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { SessionService } from '../session/session.service';
import { ValidateResponseDto } from './dto/validate-response.dto';
import { Bearer } from "src/common/decorators/bearer.decorator";
import { LoginByPasswordDto } from "./dto/login-by-password.dto";
import { LoginBySessionDto } from "./dto/login-by-session.dto";
import { AuthDataDto } from "./dto/auth-data.dto";

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: UserService,
		private sessionService: SessionService,
	) {}

	// Авторизация по токенам

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Авторизация в API по логину и паролю',
	})
	@ApiOkResponse({
		description: 'Авторизация в API по логину и паролю',
		type: AuthDataDto,
		isArray: false,
		status: 200,
	})
	async login(
		@Body() loginData: LoginByPasswordDto
	): Promise<AuthDataDto> {
		return await this.authService.signInByPassword(loginData);
	}

	@Get('me')
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Информация обо мне',
	})
	@ApiOkResponse({
		description: 'Информация об авторизованном пользователе',
		type: UserDto,
		isArray: false,
		status: 200,
	})
	async me(@JwtUser('id') userId: string): Promise<UserDto> {
		return await this.userService.getUserById(Number(userId));
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Логаут',
	})
	@ApiOkResponse({
		description: 'Логаут',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	async logout(@JwtUser('id') userId: string, @JwtToken() token: string): Promise<DefaultResponse> {
		return this.authService.logout(Number(userId), token);
	}

	// Авторизация по сессии

	@Post('session/login')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Silent auth - получение токенов по сессии',
	})
	@ApiOkResponse({
		description: 'Получение токенов по сессии',
		type: IJwtToken,
		isArray: false,
		status: 200,
	})
	async silentLogin(@Body() loginData: LoginBySessionDto): Promise<IJwtToken> {
		return await this.authService.signInBySession(loginData.sessionId);
	}

	@Post('session/refresh')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Обновление сессии',
	})
	@ApiOkResponse({
		description: 'Сессия обновлена',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	async refreshSession(@Body() silentLoginDto: LoginBySessionDto): Promise<DefaultResponse> {
		return await this.authService.refreshUserSession(silentLoginDto.sessionId);
	}

	@Post('session/delete')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Удаление сессии',
	})
	@ApiOkResponse({
		description: 'Сессия удалена',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	async deleteSession(@Body() loginData: LoginBySessionDto): Promise<DefaultResponse> {
		await this.sessionService.deleteSession(loginData.sessionId);
		return { success: true };
	}

	@Post('validate')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Валидация токена',
	})
	@ApiOkResponse({
		description: 'Информация о пользователе',
		type: ValidateResponseDto,
		isArray: false,
		status: 200,
	})
	async validateToken(
		@Bearer() token: string,
		@Headers('authorization') authHeader: string,
	): Promise<UserDto> {
		return await this.authService.validateToken(token);
	}
}
