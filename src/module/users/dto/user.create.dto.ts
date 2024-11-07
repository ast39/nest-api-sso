import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDto {
	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'login' })
	@ApiProperty({
		title: 'Логин',
		description: 'Логин пользователя',
		type: String,
		required: true,
		maxLength: 255,
	})
	login: string;

	@IsOptional()
	@IsString()
	@Expose({ name: 'password' })
	@ApiProperty({
		title: 'Пароль',
		description: 'Пароль пользователя',
		type: String,
		required: false,
		maxLength: 255,
	})
	password?: string;

	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'name' })
	@ApiProperty({
		title: 'ФИО',
		description: 'ФИО пользователя',
		type: String,
		required: true,
		maxLength: 255,
	})
	name: string;

	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'position' })
	@ApiProperty({
		title: 'Должность',
		description: 'Должность пользователя',
		type: String,
		required: true,
		maxLength: 255,
	})
	position: string;

	@IsNotEmpty()
	@IsArray()
	@ArrayNotEmpty()
	@IsInt({ each: true })
	@Type(() => Number)
	@Expose({ name: 'roles' })
	@ApiProperty({
		title: 'Роли',
		description: 'Список ID ролей пользователя',
		type: [Number],
		required: true,
	})
	roles: number[];
}
