import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Headers } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IJwtToken } from '../../common/interfaces/jwt.interface';
import { LoginDto } from './dto/login.dto';
import { UserDto } from '../users/dto/user.dto';
import { JwtUser } from '../../common/decorators/user.decorator';
import { UserService } from '../users/user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtToken } from '../../common/decorators/jwt.decorator';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { SilentLoginDto } from './dto/silent-login.dto';
import { SessionService } from '../session/session.service';
import { ValidateResponseDto } from './dto/validate-response.dto';
import { TokenExpireException } from './exceptions/auth.exeptions';
import { Bearer } from "src/common/decorators/bearer.decorator";

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
		type: IJwtToken,
		isArray: false,
		status: 200,
	})
	async login(@Body() loginDto: LoginDto): Promise<IJwtToken> {
		return await this.authService.signIn(loginDto);
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
	async silentLogin(@Body() silentLoginDto: SilentLoginDto): Promise<IJwtToken> {
		return await this.authService.silentLogin(silentLoginDto.sessionId);
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
	async refreshSession(@Body() silentLoginDto: SilentLoginDto): Promise<DefaultResponse> {
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
	async deleteSession(@Body() silentLoginDto: SilentLoginDto): Promise<DefaultResponse> {
		await this.sessionService.deleteSession(silentLoginDto.sessionId);
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
