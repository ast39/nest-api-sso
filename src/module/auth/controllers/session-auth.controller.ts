import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Headers } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SessionAuthService } from '../services/session-auth.service';
import { IJwtToken } from '../../../common/interfaces/jwt.interface';
import { DefaultResponse } from '../../../common/dto/default.response.dto';
import { SessionService } from '../../session/session.service';
import { LoginBySessionDto } from "../dto/login-by-session.dto";

@ApiTags('Авторизация по сессии')
@Controller('auth')
export class SessionAuthController {
	constructor(
		private sessionAuthService: SessionAuthService,
		private sessionService: SessionService,
	) {}

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
		return await this.sessionAuthService.signInBySession(loginData.sessionId);
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
		return await this.sessionAuthService.refreshUserSession(silentLoginDto.sessionId);
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
}
