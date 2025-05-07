import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TgAuthService } from '../services/tg-auth.service';
import { DefaultResponse } from '../../../common/dto/default.response.dto';
import { TgBotLinkDto } from '../dto/tg-bot-link.dto';
import { TgBotConfirmDto } from '../dto/tg-bot-confirm.dto';
import { TgBotLoginDto } from '../dto/tg-bot-login.dto';
import { IJwtToken } from '../../../common/interfaces/jwt.interface';

@ApiTags('Авторизация через TG')
@Controller('auth')
export class TgAuthController {
  constructor(private authService: TgAuthService) {}

  @ApiOperation({ summary: 'Генерация разовой ссылки для бота' })
  @ApiOkResponse({
    description: 'Генерация разовой ссылки для бота',
    type: TgBotLinkDto,
    isArray: false,
    status: 201,
  })
  @Post('tg/signup')
  async signup(): Promise<TgBotLinkDto> {
    return this.authService.generateUuid();
  }

  @ApiOperation({ summary: 'Подтверждение авторизации в боте' })
  @ApiOkResponse({
    description: 'Подтверждение авторизации в боте',
    type: DefaultResponse,
    isArray: false,
    status: 201,
  })
  @Post('tg/confirm')
  async confirm(@Body() confirmDto: TgBotConfirmDto): Promise<DefaultResponse> {
    return await this.authService.confirm(confirmDto);
  }

  @ApiOperation({ summary: 'Обновление токенов' })
  @ApiOkResponse({
    description: 'Обновление токенов',
    type: IJwtToken,
    isArray: false,
    status: 200,
  })
  @Post('tg/signin')
  async signin(@Body() authDto: TgBotLoginDto): Promise<IJwtToken> {
    return this.authService.auth(authDto);
  }
}
