import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RoleCreateDto {
	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'name' })
	@ApiProperty({
		title: 'Наименование',
		description: 'Наименование роли',
		type: String,
		required: true,
	})
	name: string;

	@IsOptional()
	@IsString()
	@Expose({ name: 'description' })
	@ApiProperty({
		title: 'Описание',
		description: 'Описание роли',
		type: String,
		required: false,
		default: null,
	})
	description?: string;

	@IsOptional()
	@IsBoolean()
	@Expose({ name: 'isBlocked' })
	@ApiProperty({
		title: 'Метка блока',
		description: 'Указывает, что роль заблокирована',
		type: Boolean,
		required: false,
		default: false,
	})
	isBlocked?: boolean;
}
