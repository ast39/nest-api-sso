import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class RoleFilterDto extends PaginationDto {
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

	@IsOptional()
	@IsBoolean()
	@Expose({ name: 'isBlocked' })
	@ApiProperty({
		title: 'Метка блока',
		description: 'Указывает, что роль заблокирована',
		type: Boolean,
		required: false,
	})
	isBlocked?: boolean;
}
