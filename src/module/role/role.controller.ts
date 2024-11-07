import {
	Body,
	Controller,
	Param,
	Get,
	Put,
	Delete,
	Post,
	HttpCode,
	HttpStatus,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { CurrentUrl } from '../../common/decorators/url.decorator';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { RoleDto } from './dto/role.dto';
import { RoleFilterDto } from './dto/role-filter.dto';
import { RoleService } from './role.service';
import { RoleCreateDto } from './dto/role-create.dto';
import { RoleUpdateDto } from './dto/role-update.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Роли пользователей')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoleController {
	constructor(private roleService: RoleService) {}

	@Get()
	@ApiOperation({
		summary: 'Список ролей',
		description: 'Получить список ролей по фильтрам',
	})
	@ApiOkResponse({
		description: 'Список ролей',
		type: RoleDto,
		isArray: true,
		status: 200,
	})
	public async index(
		@CurrentUrl('role') url: string,
		@Query() query: RoleFilterDto,
	): Promise<PaginationInterface<RoleDto>> {
		return await this.roleService.roleList(url, query);
	}

	@Get(':role_id')
	@ApiOperation({
		summary: 'Роль по ID',
		description: 'Получить информацию о роли',
	})
	@ApiOkResponse({
		description: 'Информация о роли',
		type: RoleDto,
		isArray: false,
		status: 200,
	})
	public async show(@Param('role_id') roleId: string): Promise<RoleDto> {
		return await this.roleService.getRoleById(Number(roleId));
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Добавление роли',
		description: 'Добавление роли',
	})
	@ApiResponse({
		description: 'Добавленная роль',
		type: RoleDto,
		isArray: false,
		status: 201,
	})
	@Roles('admin')
	public async create(@Body() body: RoleCreateDto): Promise<RoleDto> {
		return await this.roleService.createRole(body);
	}

	@Put(':role_id')
	@ApiOperation({
		summary: 'Редактирование роли',
		description: 'Редактирование роли',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	@Roles('admin')
	public async update(@Param('role_id') roleId: string, @Body() body: RoleUpdateDto): Promise<DefaultResponse> {
		return await this.roleService.updateRole(Number(roleId), body);
	}

	@Delete(':role_id')
	@ApiOperation({
		summary: 'Удаление роли',
		description: 'Удаление роли',
	})
	@ApiOkResponse({
		description: 'Простой boolean статус действия',
		type: DefaultResponse,
		isArray: false,
		status: 200,
	})
	@Roles('admin')
	public async delete(@Param('role_id') roleId: string): Promise<DefaultResponse> {
		return await this.roleService.deleteRole(Number(roleId));
	}
}
