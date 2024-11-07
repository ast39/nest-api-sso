import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IJwtToken } from '../../common/interfaces/jwt.interface';
import { LoginDto } from './dto/login.dto';
import { UserDto } from '../users/dto/user.dto';
import { JwtUser } from '../../common/decorators/user.decorator';
import { UserService } from '../users/user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtToken } from '../../common/decorators/jwt.decorator';
import { RefreshDto } from './dto/refresh.dto';
import { DefaultResponse } from '../../common/dto/default.response.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: UserService,
	) {}

	@Post('login')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Авторизация в API по логину и паролю',
	})
	@ApiOkResponse({
		description: 'Авторизация в API по логину и паролю',
		type: IJwtToken,
		isArray: false,
		status: 201,
	})
	async login(@Body() loginDto: LoginDto): Promise<IJwtToken> {
		return await this.authService.signIn(loginDto);
	}

	@Get('me')
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

	@Post('refresh')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Обновление токенов' })
	@ApiOkResponse({
		description: 'Обновление токенов',
		type: IJwtToken,
		isArray: false,
		status: 201,
	})
	refresh(@Body() refreshData: RefreshDto) {
		return this.authService.refreshTokens(refreshData);
	}

	@Post('logout')
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
}
