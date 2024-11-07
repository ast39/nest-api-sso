import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
	@IsInt()
	@IsOptional()
	@Type(() => Number)
	@ApiProperty({
		title: 'Страница',
		description: 'Текущая страница списка',
		default: 1,
		type: Number,
		required: false,
	})
	page?: number = 1;

	@IsInt()
	@IsOptional()
	@Type(() => Number)
	@ApiProperty({
		title: 'Кол-во записей',
		description: 'Кол-во записей на странице',
		default: 10,
		type: Number,
		required: false,
	})
	limit?: number = 10;
}
