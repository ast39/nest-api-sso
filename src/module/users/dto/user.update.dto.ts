import { ArrayNotEmpty, IsArray, IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateDto {
	@IsOptional()
	@IsString()
	@Expose({ name: 'name' })
	@ApiProperty({
		title: 'ФИО',
		description: 'ФИО пользователя',
		type: String,
		required: true,
		maxLength: 255,
	})
	name?: string;

	@IsOptional()
	@IsString()
	@Expose({ name: 'position' })
	@ApiProperty({
		title: 'Должность',
		description: 'Должность пользователя',
		type: String,
		required: false,
		maxLength: 255,
	})
	position?: string;

	@IsOptional()
	@IsString()
	@Expose({ name: 'refreshToken' })
	@ApiProperty({
		title: 'Refresh токен',
		description: 'Новый refresh token пользователя, если он изменился',
		type: String,
		required: false,
	})
	refreshToken?: string;

	@IsOptional()
	@IsArray()
	@ArrayNotEmpty()
	@IsInt({ each: true })
	@Type(() => Number)
	@Expose({ name: 'roles' })
	@ApiProperty({
		title: 'Роли',
		description: 'Список ID ролей пользователя',
		type: [Number],
		required: false,
	})
	roles?: number[];
}
