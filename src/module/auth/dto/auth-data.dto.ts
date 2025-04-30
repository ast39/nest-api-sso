import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsBoolean, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { IJwtToken } from '../../../common/interfaces/jwt.interface';
import { RoleDto } from '../../role/dto/role.dto';

export class AuthDataDto extends IJwtToken {
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

	@IsBoolean()
	@Expose({ name: 'isRoot' })
	@ApiProperty({
		title: 'Метка администратора',
		description: 'Указывает, что пользователь администратор',
		type: Boolean,
	})
	isRoot: boolean;

	@IsString()
	@Expose({ name: 'sessionId' })
	@ApiProperty({
		title: 'ID сессии',
		description: 'ID сессии пользователя',
		type: String,
	})
	sessionId: string;
}