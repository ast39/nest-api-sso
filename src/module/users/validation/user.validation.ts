import { Injectable } from '@nestjs/common';
import { IPrismaTR } from '../../../prisma';
import { UserRepository } from '../user.repository';
import { BadUserException, UserDoubleException } from '../exceptions/user.exceptions';
import { UserCreateDto } from '../dto/user.create.dto';
import { UserUpdateDto } from '../dto/user.update.dto';

@Injectable()
export class UserValidation {
	public constructor(private readonly userRepository: UserRepository) {}

	// Проверка, что пользователь существует
	public async assertUserExists(tx: IPrismaTR, userId: number): Promise<void> {
		const user = await this.userRepository.show(userId, tx);
		if (!user) {
			throw new BadUserException();
		}
	}

	// Проверка, что пользователь уникален
	public async assertUniqueUser(tx: IPrismaTR, data: UserCreateDto | UserUpdateDto, userId?: number): Promise<void> {
		if (data.name) {
			let users = await this.userRepository.index({ where: { name: data.name } }, tx);
			if (users) {
				users = users.filter((userItem) => +userItem.id !== +userId);
			}
			if (users.length !== 0) {
				throw new UserDoubleException();
			}
		}
	}
}
