import { ArrayNotEmpty, IsArray, IsBoolean, IsDate, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '../interfaces/user.prisma.interface';
import { RoleDto } from '../../role/dto/role.dto';

export class UserDto {
	public constructor(user: IUser) {
		this.id = user.id;
		this.name = user.name;
		this.position = user.position;
		this.isRoot = user.isRoot;
		this.isBlocked = user.isBlocked;
		this.createdAt = user.createdAt;

		this.roles = user.roles ? user.roles.map((role) => new RoleDto(role.role)) : null;
	}

	@IsNumber()
	@Expose({ name: 'id' })
	@ApiProperty({
		title: 'ID',
		description: 'ID пользователя',
		type: Number,
		format: 'int32',
	})
	id: number;

	@IsString()
	@Expose({ name: 'login' })
	@ApiProperty({
		title: 'Логин',
		description: 'Логин пользователя',
		type: String,
	})
	login: string;

	@IsString()
	@Expose({ name: 'name' })
	@ApiProperty({
		title: 'ФИО',
		description: 'ФИО пользователя',
		type: String,
	})
	name: string;

	@IsString()
	@Expose({ name: 'position' })
	@ApiProperty({
		title: 'Должность',
		description: 'Должность пользователя',
		type: String,
	})
	position: string;

	@IsBoolean()
	@Expose({ name: 'isRoot' })
	@ApiProperty({
		title: 'Метка администратора',
		description: 'Указывает, что пользователь администратор',
		type: Boolean,
	})
	isRoot: boolean;

	@IsBoolean()
	@Expose({ name: 'isBlocked' })
	@ApiProperty({
		title: 'Метка блока',
		description: 'Указывает, что пользователь заблокирован',
		type: Boolean,
	})
	isBlocked: boolean;

	@IsDate()
	@Expose({ name: 'createdAt' })
	@ApiProperty({
		title: 'Время добавления',
		description: 'Время добавления статуса',
		type: Date,
	})
	createdAt: Date;

	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => RoleDto)
	@Expose({ name: 'roles' })
	@ApiProperty({
		title: 'Роли',
		description: 'Список ролей пользователя',
		type: () => [RoleDto],
		isArray: true,
	})
	roles?: RoleDto[];
}
