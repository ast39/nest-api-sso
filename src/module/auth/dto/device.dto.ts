import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeviceDto {
	@IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Уникальный идентификатор устройства',
        example: 'device_123456',
        type: String,
        required: true,
    })
    deviceId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Название устройства',
        example: 'iPhone 12',
        type: String,
        required: true,
    })
    deviceName: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Тип устройства (mobile, tablet, desktop)',
        example: 'mobile',
        type: String,
        required: false,
    })
    deviceType?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Браузер',
        example: 'Chrome 120.0.0',
        type: String,
        required: false,
    })
    browser?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Операционная система',
        example: 'iOS 16.0',
        type: String,
        required: false,
    })    
    os?: string;
}
