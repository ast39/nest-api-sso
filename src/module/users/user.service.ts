import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { DefaultResponse } from '../../common/dto/default.response.dto';
import { UserRepository } from './user.repository';
import { UserValidation } from './validation/user.validation';
import { RootUserException, UserNotFoundException } from "./exceptions/user.exceptions";
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { UserVsPassDto } from './dto/user-vs-pass.dto';
import { PaginationInterface } from '../../common/interfaces/pagination.interface';
import { UserFilterDto } from './dto/user.filter.dto';
import { IUser, IUserFilter } from './interfaces/user.prisma.interface';
import { UserVsRefreshDto } from './dto/user-vs-refresh.dto';

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private userRepo: UserRepository,
		private readonly userValidator: UserValidation,
	) {}

	// Список пользователей
	async userList(url: string, userFilter: UserFilterDto): Promise<PaginationInterface<UserDto>> {
		const page = Number(userFilter.page ?? 1);
		const limit = Number(userFilter.limit ?? 10);
		const whereCondition: IUserFilter = {
			OR: [
				{
					name: {
						contains: userFilter.query || '',
						mode: 'insensitive',
					},
				},
				{
					position: {
						contains: userFilter.query || '',
						mode: 'insensitive',
					},
				},
				{
					login: {
						contains: userFilter.query || '',
						mode: 'insensitive',
					},
				},
			],
			isDeleted: false,
		};

		// Список пользователей
		const users = await this.prisma.$transaction(async (tx) => {
			const users = await this.userRepo.index(
				{
					skip: (page - 1) * limit,
					take: limit,
					where: whereCondition,
					orderBy: { createdAt: 'desc' },
				},
				tx,
			);

			if (!users.length) {
				throw new UserNotFoundException();
			}

			return users;
		});

		// Всего пользователей
		const totalRows = await this.prisma.$transaction(async (tx) => {
			return await this.userRepo.totalRows(
				{
					where: whereCondition,
				},
				tx,
			);
		});

		// Ответ
		return {
			data: users.map((user) => new UserDto(user as IUser)),
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

	// Найти пользователя по ID
	async getUserById(userId: number): Promise<UserDto> {
		return this.prisma.$transaction(async (tx) => {
			// Получим пользователя
			const user = await this.userRepo.show(userId, tx);
			if (!user || user.isDeleted === true) {
				throw new UserNotFoundException();
			}

			return new UserDto(user as IUser);
		});
	}

	// Найти пользователя по логину
	async getUserByLogin(userLogin: string): Promise<User | null> {
		return this.prisma.$transaction(async (tx) => {
			// Получим пользователя
			const users = await this.userRepo.index({ where: { login: userLogin } }, tx);

			return users[0] ?? null;
		});
	}

	// Найти пользователя по ID c refresh токеном
	async getUserByIdVsRefresh(userId: number): Promise<UserVsRefreshDto> {
		return this.prisma.$transaction(async (tx) => {
			// Получим пользователя
			const user = await this.userRepo.show(userId, tx);
			if (!user || user.isDeleted === true) {
				throw new UserNotFoundException();
			}

			return new UserVsRefreshDto(user as IUser);
		});
	}

	// Добавить пользователя
	async createUser(data: UserCreateDto): Promise<UserVsPassDto> {
		return this.prisma.$transaction(async (tx) => {
			await this.userValidator.assertUniqueUser(tx, data);
			const password = data.password ?? Math.random().toString(36).slice(-8);
			data.password = await bcrypt.hash(password, 10);
			const newUser = await this.userRepo.store(data, tx);
			newUser.password = password;

			return new UserVsPassDto(newUser);
		});
	}

	// Обновить пользователя
	async updateUser(userId: number, data: UserUpdateDto): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			await this.userValidator.assertUniqueUser(tx, data, userId);

			// Получим пользователя
			await this.getUserById(userId);

			// Обновим пользователя
			await this.userRepo.update(
				{
					where: { id: +userId },
					data: data,
				},
				tx,
			);

			return { success: true };
		});
	}

	// Заблокировать пользователя
	async blockUser(userId: number): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Получим пользователя
			const user = await this.getUserById(userId);

			if (user.isRoot) {
				throw new RootUserException();
			}

			// Заблокируем пользователя
			await this.userRepo.block({ id: +userId }, tx);

			return { success: true };
		});
	}

	// Разблокировать пользователя
	async unblockUser(userId: number): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Получим пользователя
			const user = await this.getUserById(userId);

			if (user.isRoot) {
				throw new RootUserException();
			}

			// Разблокируем пользователя
			await this.userRepo.unBlock({ id: +userId }, tx);

			return { success: true };
		});
	}

	// Удалить пользователя
	async deleteUser(userId: number): Promise<DefaultResponse> {
		return this.prisma.$transaction(async (tx) => {
			// Получим пользователя
			const user = await this.getUserById(userId);

			if (user.isRoot) {
				throw new RootUserException();
			}

			// Удалим пользователя
			await this.userRepo.destroy({ id: +userId }, tx);

			return { success: true };
		});
	}
}
