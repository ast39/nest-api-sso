import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class RefreshDto {
	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'refreshToken' })
	@ApiProperty({
		title: 'Refresh JWT токен',
		description: 'Refresh JWT токен',
		type: String,
		required: true,
	})
	refreshToken: string;
}
