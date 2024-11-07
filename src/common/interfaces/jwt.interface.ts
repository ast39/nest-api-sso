import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class IJwtToken {
	@Expose({ name: 'accessToken' })
	@ApiProperty({
		title: 'JWT Токен авторизации',
		description: 'JWT токен для авторизации',
		default: '',
		type: String,
	})
	accessToken: string;

	@Expose({ name: 'refreshToken' })
	@ApiProperty({
		title: 'JWT Токен обновления',
		description: 'JWT токен для обновления авторизации',
		default: '',
		type: String,
	})
	refreshToken: string;
}
