import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class DefaultResponse {
	@ApiProperty({
		title: 'Статус',
		description: 'Статус действия',
		type: Boolean,
		default: true,
	})
	@IsBoolean()
	@IsNotEmpty()
	success: boolean = true;
}
