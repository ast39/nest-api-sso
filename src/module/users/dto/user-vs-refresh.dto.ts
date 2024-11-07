import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '../interfaces/user.prisma.interface';
import { UserDto } from './user.dto';

export class UserVsRefreshDto extends UserDto {
	public constructor(user: IUser) {
		super(user);
		this.refreshToken = user.refreshToken;
	}

	@IsString()
	@Expose({ name: 'refreshToken' })
	@ApiProperty({
		title: 'Refresh токен',
		description: 'Refresh token пользователя',
		type: String,
	})
	refreshToken: string;
}
