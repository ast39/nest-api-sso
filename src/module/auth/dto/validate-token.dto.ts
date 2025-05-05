import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ValidateTokenDto {
  @ApiProperty({
    title: 'Идентификатор сессии',
    description: 'Идентификатор сессии (опционально, если передается через cookie)',
    type: String,
    required: false,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  sessionId?: string;
} 