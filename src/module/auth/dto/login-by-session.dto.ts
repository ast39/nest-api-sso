import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginBySessionDto {
  @ApiProperty({
    title: 'Идентификатор сессии',
    description: 'Идентификатор сессии (опционально, если передается через cookie)',
    type: String,
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsString()
  sessionId: string;
} 