import { Injectable } from '@nestjs/common';
import { IPrismaTR, PrismaService } from '../../prisma';
import { User } from '@prisma/client';
import { UserCreateDto } from './dto/user.create.dto';
import { IUserFilter, IUserOrder, IUserUnique } from './interfaces/user.prisma.interface';
import { UserUpdateDto } from './dto/user.update.dto';

@Injectable()
export class UserRepository {
	constructor(private prisma: PrismaService) {}

	// Всего пользователей без пагинации
	async totalRows(
		params: {
			cursor?: IUserUnique;
			where?: IUserFilter;
		},
		tx?: IPrismaTR,
	): Promise<number> {
		const { cursor, where } = params;
		const prisma = tx ?? this.prisma;

		return prisma.user.count({
			cursor,
			where,
		});
	}

	// Список пользователей
	async index(
		params: {
			skip?: number;
			take?: number;
			where?: IUserFilter;
			orderBy?: IUserOrder;
		},
		tx?: IPrismaTR,
	): Promise<User[]> {
		const { skip, take, where, orderBy } = params;
		const prisma = tx ?? this.prisma;

		return prisma.user.findMany({
			include: {
				roles: {
					include: {
						role: true,
					},
				},
			},
			skip,
			take,
			where,
			orderBy,
		});
	}

	// Пользователь по ID
	async show(userId: number, tx?: IPrismaTR): Promise<User> {
		const prisma = tx ?? this.prisma;

		return prisma.user.findUnique({
			where: { id: userId },
			include: {
				roles: {
					include: {
						role: true,
					},
				},
			},
		});
	}

	// Добавить пользователя
	async store(data: UserCreateDto, tx?: IPrismaTR): Promise<User> {
		const prisma = tx ?? this.prisma;

		return prisma.user.create({
			data: {
				login: data.login,
				password: data.password,
				name: data.name,
				position: data.position,
				isRoot: false,
				isBlocked: false,
				roles: {
					create: data.roles.map((roleId) => ({
						role: {
							connect: { id: roleId },
						},
					})),
				},
			},
			include: {
				roles: {
					include: {
						role: true,
					},
				},
			},
		});
	}

	// Обновить пользователя
	async update(
		params: {
			where: IUserUnique;
			data: UserUpdateDto;
		},
		tx?: IPrismaTR,
	): Promise<User> {
		const { where, data } = params;
		const prisma = tx ?? this.prisma;

		// Обработка ролей: если они указаны, обновляем связи
		if (data.roles) {
			await prisma.user.update({
				where,
				data: {
					roles: {
						// Удаляем все текущие связи
						deleteMany: {},
					},
				},
			});

			// Добавляем новые связи, если массив ролей не пустой
			if (data.roles.length > 0) {
				await prisma.user.update({
					where,
					data: {
						roles: {
							create: data.roles.map((roleId) => ({
								role: { connect: { id: roleId } },
							})),
						},
					},
				});
			}
		}

		const updateData: any = {};

		if (data.name) {
			updateData.name = data.name;
		}
		if (data.position) {
			updateData.position = data.position;
		}
		if (data.refreshToken) {
			updateData.refreshToken = data.refreshToken;
		}

		return prisma.user.update({
			where,
			data: updateData,
			include: {
				roles: true,
			},
		});
	}

	// Заблокировать пользователя
	async block(where: IUserUnique, tx?: IPrismaTR): Promise<User> {
		const prisma = tx ?? this.prisma;

		return prisma.user.update({
			where,
			data: { isBlocked: true },
		});
	}

	// Разблокировать пользователя
	async unBlock(where: IUserUnique, tx?: IPrismaTR): Promise<User> {
		const prisma = tx ?? this.prisma;

		return prisma.user.update({
			where,
			data: { isBlocked: false },
		});
	}

	// Удалить пользователя (мягкое удаление)
	async destroy(where: IUserUnique, tx?: IPrismaTR): Promise<User> {
		const prisma = tx ?? this.prisma;

		return prisma.user.update({
			where,
			data: { isDeleted: true },
		});
	}
}
