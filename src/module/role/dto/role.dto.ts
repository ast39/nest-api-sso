import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IRole } from '../interfaces/role.prisma.interface';

export class RoleDto {
	public constructor(role: IRole) {
		this.id = role.id;
		this.name = role.name;
		this.description = role.description;
		this.isBlocked = role.isBlocked;
		this.createdAt = role.createdAt;
	}

	@IsNumber()
	@Expose({ name: 'id' })
	@ApiProperty({
		title: 'ID',
		description: 'ID роли',
		type: Number,
		format: 'int32',
	})
	id: number;

	@IsString()
	@Expose({ name: 'name' })
	@ApiProperty({
		title: 'Наименование',
		description: 'Наименование роли',
		type: String,
	})
	name: string;

	@IsString()
	@Expose({ name: 'description' })
	@ApiProperty({
		title: 'Описание',
		description: 'Описание роли',
		type: String,
	})
	description: string;

	@IsBoolean()
	@Expose({ name: 'isBlocked' })
	@ApiProperty({
		title: 'Метка блока',
		description: 'Указывает, что роль заблокирована',
		type: Boolean,
	})
	isBlocked: boolean;

	@IsDate()
	@Expose({ name: 'createdAt' })
	@ApiProperty({
		title: 'Время добавления',
		description: 'Время добавления роли',
		type: Date,
	})
	createdAt: Date;
}
