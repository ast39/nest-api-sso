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

	@IsOptional()
	@IsString()
	@Expose({ name: 'department' })
	@ApiProperty({
		title: 'Отдел',
		description: 'Отдел пользователя',
		type: String,
		required: false,
	})
	department?: string;
	
	@IsOptional()
	@IsString()
	@Expose({ name: 'position' })
	@ApiProperty({
		title: 'Должность',
		description: 'Должность пользователя',
		type: String,
		required: true,
		maxLength: 255,
	})
	position?: string;

	@IsOptional()
	@IsString()
	@Expose({ name: 'email' })
	@ApiProperty({
		title: 'Email',
		description: 'Email пользователя',
		type: String,
		required: false,
	})
	email?: string;

	@IsOptional()
	@IsString()
	@Expose({ name: 'phone' })
	@ApiProperty({
		title: 'Телефон',
		description: 'Телефон пользователя',
		type: String,
		required: false,
	})
	phone?: string;

	@IsOptional()
	@IsString()
	@Expose({ name: 'telegramId' })
	@ApiProperty({
		title: 'Телеграм ID',
		description: 'Телеграм ID пользователя',
		type: String,
		required: false,
	})
	telegramId?: string;

	@IsOptional()
	@IsString()
	@Expose({ name: 'telegramName' })
	@ApiProperty({
		title: 'Телеграм имя',
		description: 'Телеграм имя пользователя',
		type: String,
		required: false,
	})
	telegramName?: string;

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
