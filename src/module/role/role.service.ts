import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { RoleRepository } from './role.repository';
import { RoleValidation } from './validation/role.validation';
import { RoleFilterDto } from './dto/role-filter.dto';
import { RoleDto } from './dto/role.dto';
import { IRoleFilter } from './interfaces/role.prisma.interface';
import { RoleNotFoundException } from './exceptions/role.exceptions';
import { RoleCreateDto } from './dto/role-create.dto';
import { RoleUpdateDto } from './dto/role-update.dto';

@Injectable()
export class RoleService {
	constructor(
		private prisma: PrismaService,
		private roleRepo: RoleRepository,
		private readonly roleValidator: RoleValidation,
	) {}

	// Список ролей
	async roleList(url: string, roleFilter: RoleFilterDto): Promise<PaginationInterface<RoleDto>> {
		const page = Number(roleFilter.page ?? 1);
		const limit = Number(roleFilter.limit ?? 10);
		const whereCondition: IRoleFilter = {
			OR: [
				{
					name: {
						contains: roleFilter.query || '',
						mode: 'insensitive',
					},
				},
				{
					description: {
						contains: roleFilter.query || '',
						mode: 'insensitive',
					},
				},
			],
			isBlocked: roleFilter.isBlocked || undefined,
			isDeleted: false,
		};

		// Список ролей
		const roles = await this.prisma.$transaction(async (tx) => {
			const roles = await this.roleRepo.index(
				{
					skip: (page - 1) * limit,
					take: limit,
					where: whereCondition,
					orderBy: { createdAt: 'desc' },
				},
				tx,
			);

			if (!roles.length) {
				throw new RoleNotFoundException();
			}

			return roles;
		});

		// Всего ролей
		const totalRows = await this.prisma.$transaction(async (tx) => {
			return await this.roleRepo.totalRows(
				{
					where: whereCondition,
				},
				tx,
			);
		});

		// Ответ
		return {
			data: roles.map((role) => new RoleDto(role)),
			meta: {
				currentPage: page,
				lastPage: Math.ceil(totalRows / limit),
				perPage: limit,
				from: (page - 1) * limit + 1,
				to: (page - 1) * limit + limit,
				total: totalRows,
				path: url,
			},
		};
	}

	// Найти роль по ID
	async getRoleById(userId: number): Promise<RoleDto> {
		return this.prisma.$transaction(async (tx) => {
			// Получим пользователя
			const role = await this.roleRepo.show(userId, tx);
			if (!role || role.isDeleted === true) {
				throw new RoleNotFoundException();
			}

			return new RoleDto(role);
		});
	}

	// Добавить роль
	async createRole(data: RoleCreateDto): Promise<RoleDto> {
		return this.prisma.$transaction(async (tx) => {
			await this.roleValidator.assertUniqueRole(tx, data);
			const newRole = await this.roleRepo.store(data, tx);

			return new RoleDto(newRole);
		});
	}

	// Обновить пользователя
	async updateRole(roleId: number, data: RoleUpdateDto): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			await this.roleValidator.assertUniqueRole(tx, data, roleId);

			// Получим роль
			await this.getRoleById(roleId);

			// Обновим роль
			await this.roleRepo.update(
				{
					where: { id: +roleId },
					data: data,
				},
				tx,
			);

			return { success: true };
		});
	}

	// Удалить роль
	async deleteRole(roleId: number): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Получим роль
			await this.getRoleById(roleId);

			// Удалим роль
			await this.roleRepo.destroy({ id: +roleId }, tx);

			return { success: true };
		});
	}
}
