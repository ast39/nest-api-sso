import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { DeviceDto } from './device.dto';

export class LoginByPasswordDto {
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
	@Expose({ name: 'password' })
	@ApiProperty({
		title: 'Пароль',
		description: 'Пароль пользователя',
		type: String,
		required: true,
	})
	password: string;

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => DeviceDto)
	@Expose({ name: 'device' })
	@ApiProperty({
		title: 'Устройство',
		description: 'Устройство пользователя',
		type: DeviceDto,
		required: true,
	})
	device: DeviceDto;
}
