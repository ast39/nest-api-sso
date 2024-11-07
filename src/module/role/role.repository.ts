import { Injectable } from '@nestjs/common';
import { IPrismaTR, PrismaService } from '../../prisma';
import { Role } from '@prisma/client';
import { IRoleFilter, IRoleOrder, IRoleUnique } from './interfaces/role.prisma.interface';
import { RoleUpdateDto } from './dto/role-update.dto';
import { RoleCreateDto } from './dto/role-create.dto';

@Injectable()
export class RoleRepository {
	constructor(private prisma: PrismaService) {}

	// Всего ролей без пагинации
	async totalRows(
		params: {
			cursor?: IRoleUnique;
			where?: IRoleFilter;
		},
		tx?: IPrismaTR,
	): Promise<number> {
		const { cursor, where } = params;
		const prisma = tx ?? this.prisma;

		return prisma.role.count({
			cursor,
			where,
		});
	}

	// Список ролей
	async index(
		params: {
			skip?: number;
			take?: number;
			where?: IRoleFilter;
			orderBy?: IRoleOrder;
		},
		tx?: IPrismaTR,
	): Promise<Role[]> {
		const { skip, take, where, orderBy } = params;
		const prisma = tx ?? this.prisma;

		return prisma.role.findMany({
			skip,
			take,
			where,
			orderBy,
		});
	}

	// Роль по ID
	async show(roleId: number, tx?: IPrismaTR): Promise<Role> {
		const prisma = tx ?? this.prisma;

		return prisma.role.findUnique({
			where: { id: roleId },
		});
	}

	// Добавить роль
	async store(data: RoleCreateDto, tx?: IPrismaTR): Promise<Role> {
		const prisma = tx ?? this.prisma;

		return prisma.role.create({
			data: {
				name: data.name,
				description: data.description || null,
				isBlocked: data.isBlocked || false,
			},
		});
	}

	// Обновить роль
	async update(
		params: {
			where: IRoleUnique;
			data: RoleUpdateDto;
		},
		tx?: IPrismaTR,
	): Promise<Role> {
		const { where, data } = params;
		const prisma = tx ?? this.prisma;
		return prisma.role.update({
			where,
			data,
		});
	}

	// Удалить роль (мягкое удаление)
	async destroy(where: IRoleUnique, tx?: IPrismaTR): Promise<Role> {
		const prisma = tx ?? this.prisma;

		return prisma.role.update({
			where,
			data: { isDeleted: true },
		});
	}
}
