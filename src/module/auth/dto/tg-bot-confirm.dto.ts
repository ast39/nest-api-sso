import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TgBotConfirmDto {
  @ApiProperty({
    title: 'UUID',
    description: 'Авторизационный UUID',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  authKey: string;

  @ApiProperty({
    title: 'ID чата',
    description: 'ID чата',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  chatId: string;
}
