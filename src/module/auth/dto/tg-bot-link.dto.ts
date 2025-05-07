import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TgBotLinkDto {
  @ApiProperty({
    title: 'Ссылка',
    description: 'Ссылка на бота',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  link: string;
}
