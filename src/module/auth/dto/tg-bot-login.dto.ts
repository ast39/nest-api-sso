import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TgBotLoginDto {
  @ApiProperty({
    title: 'Авторизационный токен',
    description: 'Авторизационный токен',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  authKey: string;
}
