import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";
import { RoleDto } from "../../role/dto/role.dto";

export class TokenDataDto {
	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'id' })
	@ApiProperty({
		title: 'ID',
		description: 'ID пользователя',
		type: Number,
		format: 'int32',
		required: true,
	})
	id: number;

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
	@Expose({ name: 'name' })
	@ApiProperty({
		title: 'ФИО',
		description: 'ФИО пользователя',
		type: String,
		required: true,
	})
	name: string;

	@IsNotEmpty()
	@IsString()
	@Expose({ name: 'name' })
	@ApiProperty({
		title: 'Должность',
		description: 'Должность пользователя',
		type: String,
		required: true,
	})
	position: string;

	@IsOptional()
	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => RoleDto)
	@Expose({ name: 'roles' })
	@ApiProperty({
		title: 'Роли',
		description: 'Список ролей пользователя',
		type: () => [RoleDto],
		isArray: true,
	})
	roles?: RoleDto[];

	@IsNotEmpty()
	@Expose({ name: 'isRoot' })
	@ApiProperty({
		title: 'Метка администратора',
		description: 'Указывает, что пользователь администратор',
		type: Boolean,
		required: true,
	})
	isRoot: boolean;
}
