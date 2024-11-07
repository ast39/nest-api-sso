import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class LoginDto {
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
	@Expose({ name: 'password' })
	@ApiProperty({
		title: 'Пароль',
		description: 'Пароль пользователя',
		type: String,
		required: true,
	})
	password: string;
}
