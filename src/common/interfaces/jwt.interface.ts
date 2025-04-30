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
}
