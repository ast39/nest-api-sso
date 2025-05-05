import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';

export class ValidateResponseDto extends UserDto {
    @ApiProperty({
        title: 'ID сессии',
        description: 'ID сессии',
        type: String,
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    sessionId: string;
} 