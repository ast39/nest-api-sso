import { Injectable } from '@nestjs/common';
import { IPrismaTR } from '../../../prisma';
import { RoleRepository } from '../role.repository';
import { RoleCreateDto } from '../dto/role-create.dto';
import { RoleUpdateDto } from '../dto/role-update.dto';
import { BadRoleException, RoleDoubleException } from '../exceptions/role.exceptions';

@Injectable()
export class RoleValidation {
	public constructor(private readonly roleRepository: RoleRepository) {}

	// Проверка, что роль существует
	public async assertRoleExists(tx: IPrismaTR, roleId: number): Promise<void> {
		const role = await this.roleRepository.show(roleId, tx);
		if (!role) {
			throw new BadRoleException();
		}
	}

	// Проверка, что роль уникальна
	public async assertUniqueRole(tx: IPrismaTR, data: RoleCreateDto | RoleUpdateDto, roleId?: number): Promise<void> {
		if (data.name) {
			let roles = await this.roleRepository.index({ where: { name: data.name } }, tx);
			if (roles) {
				roles = roles.filter((roleItem) => +roleItem.id !== +roleId);
			}
			if (roles.length !== 0) {
				throw new RoleDoubleException();
			}
		}
	}
}
