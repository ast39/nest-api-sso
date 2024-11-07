import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '../interfaces/user.prisma.interface';
import { UserDto } from './user.dto';

export class UserVsPassDto extends UserDto {
	public constructor(user: IUser) {
		super(user);
		this.password = user.password;
	}

	@IsString()
	@Expose({ name: 'password' })
	@ApiProperty({
		title: 'Пароль',
		description: 'Пароль пользователя',
		type: String,
		format: 'int32',
	})
	password: string;
}
