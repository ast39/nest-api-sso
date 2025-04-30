import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";
import { RoleDto } from "../../role/dto/role.dto";

export class TokenDataDto {
	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'id' })
	@ApiProperty({
		title: 'ID',
		description: 'ID пользователя',
		type: Number,
		format: 'int32',
		required: true,
	})
	id: number;

	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'login' })
	@ApiProperty({
		title: 'Логин',
		description: 'Логин пользователя',
		type: String,
		required: true,
	})
	login: string;

	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'name' })
	@ApiProperty({
		title: 'ФИО',
		description: 'ФИО пользователя',
		type: String,
		required: true,
	})
	name: string;

	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'department' })
	@ApiProperty({
		title: 'Отдел',
		description: 'Отдел пользователя',
		type: String,
		required: true,
	})
	department: string;

	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'position' })
	@ApiProperty({
		title: 'Должность',
		description: 'Должность пользователя',
		type: String,
		required: true,
	})
	position: string;

	@IsNotEmpty()	
	@IsString()
	@Expose({ name: 'email' })
	@ApiProperty({
		title: 'Email',
		description: 'Email пользователя',
		type: String,
		required: true,
	})
	email: string;

	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'phone' })
	@ApiProperty({
		title: 'Телефон',
		description: 'Телефон пользователя',
		type: String,
		required: true,
	})
	phone: string;

	@ApiProperty({
		title: 'Telegram ID',
		description: 'Telegram ID пользователя',
		type: String,
		required: true,
	})
	telegramId: string;

	@IsOptional()
	@IsArray()
	@ArrayNotEmpty()
	@Type(() => RoleDto)
	@Expose({ name: 'roles' })
	@ApiProperty({
		title: 'Роли',
		description: 'Список ролей пользователя',
		type: () => [RoleDto],
		isArray: true,
	})
	roles?: RoleDto[];

	@IsNotEmpty()
	@Expose({ name: 'isRoot' })
	@ApiProperty({
		title: 'Метка администратора',
		description: 'Указывает, что пользователь администратор',
		type: Boolean,
		required: true,
	})
	isRoot: boolean;
}
