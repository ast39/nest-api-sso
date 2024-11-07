import {
	Body,
	Controller,
	Param,
	Get,
	Put,
	Delete,
	UseGuards,
	Post,
	HttpCode,
	HttpStatus,
	Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtUser } from '../../common/decorators/user.decorator';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { UserCreateDto } from './dto/user.create.dto';
import { UserVsPassDto } from './dto/user-vs-pass.dto';
import { CurrentUrl } from '../../common/decorators/url.decorator';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { UserFilterDto } from './dto/user.filter.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Пользователи')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	@ApiOperation({
		summary: 'Список пользователей',
		description: 'Получить список пользователей по фильтрам',
	})
	@ApiOkResponse({
		description: 'Список пользователей',
		type: UserDto,
		isArray: true,
		status: 200,
	})
	@Roles('admin')
	public async index(
		@JwtUser('id') userId: string,
		@CurrentUrl('user') url: string,
		@Query() query: UserFilterDto,
	): Promise<PaginationInterface<UserDto>> {
		return await this.userService.userList(url, query);
	}

	@Get(':requested_id')
	@ApiOperation({
		summary: 'Пользователь по ID',
		description: 'Получить информацию о пользователе',
	})
	@ApiOkResponse({
		description: 'Информация о пользователе',
		type: UserDto,
		isArray: false,
		status: 200,
	})
	@Roles('admin')
	public async show(@JwtUser('id') userId: string, @Param('requested_id') requestedId: string): Promise<UserDto> {
		return await this.userService.getUserById(Number(requestedId));
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Добавление пользователя',
		description: 'Добавление пользователя',
	})
	@ApiResponse({
		description: 'Добавленный статус',
		type: UserDto,
		isArray: false,
		status: 201,
	})
	@Roles('admin')
	public async create(@JwtUser('id') userId: string, @Body() body: UserCreateDto): Promise<UserVsPassDto> {
		return await this.userService.createUser(body);
	}

	@Put(':requested_id')
	@ApiOperation({
		summary: 'Редактирование пользователя',
		description: 'Редактирование пользователя',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	@Roles('admin')
	public async update(
		@JwtUser('id') userId: string,
		@Param('requested_id') requestedId: string,
		@Body() body: UserUpdateDto,
	): Promise<DefaultResponse> {
		return await this.userService.updateUser(Number(requestedId), body);
	}

	@Put(':requested_id/block')
	@ApiOperation({
		summary: 'Блокировка пользователя',
		description: 'Блокировка пользователя',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	@Roles('admin')
	public async block(
		@JwtUser('id') userId: string,
		@Param('requested_id') requestedId: string,
	): Promise<DefaultResponse> {
		return await this.userService.blockUser(Number(requestedId));
	}

	@Put(':requested_id/unblock')
	@ApiOperation({
		summary: 'Разблокировка пользователя',
		description: 'Разблокировка пользователя',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	@Roles('admin')
	public async unBlock(
		@JwtUser('id') userId: string,
		@Param('requested_id') requestedId: string,
	): Promise<DefaultResponse> {
		return await this.userService.unblockUser(Number(requestedId));
	}

	@Delete(':requested_id')
	@ApiOperation({
		summary: 'Удаление пользователя',
		description: 'Удаление пользователя',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	@Roles('admin')
	public async delete(
		@JwtUser('id') userId: string,
		@Param('requested_id') requestedId: string,
	): Promise<DefaultResponse> {
		return await this.userService.deleteUser(Number(requestedId));
	}
}
