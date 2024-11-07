import { IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class UserFilterDto extends PaginationDto {
	@IsOptional()
	@IsString()
	@Expose({ name: 'query' })
	@ApiProperty({
		title: 'Поисковая строка',
		description: 'Поисковая строка',
		type: String,
		required: false,
		maxLength: 255,
	})
	query?: string;
}
