import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EResponseType } from '../enums/responses';

export class IActionInterface<T = NonNullable<unknown>> {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		title: 'Статус',
		description: 'Статус ответа',
		type: String,
		required: true,
	})
	status: 'success' | 'error';

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		title: 'Сообщение',
		description: 'Сообщение',
		type: String,
		required: true,
	})
	message: string;

	@IsEnum(EResponseType)
	@IsOptional()
	@ApiProperty({
		title: 'Тип ответа',
		description: 'Тип ответа',
		enum: EResponseType,
		required: false,
		default: EResponseType.COMMON,
	})
	type?: EResponseType = EResponseType.COMMON;

	@IsOptional()
	@ApiProperty({
		title: 'Вложение',
		description: 'Вложение',
		type: Object,
		required: false,
	})
	result?: T;
}
