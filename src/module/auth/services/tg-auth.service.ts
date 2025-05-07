import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { TgBotLinkDto } from '../dto/tg-bot-link.dto';
import { PrismaService } from 'src/prisma';
import { TgAuthRepository } from '../repositories/tg-auth.repository';
import { TgBotConfirmDto } from '../dto/tg-bot-confirm.dto';
import { DefaultResponse } from '../../../common/dto/default.response.dto';
import { IJwtToken } from '../../../common/interfaces/jwt.interface';
import { TgBotLoginDto } from '../dto/tg-bot-login.dto';
import { UserRepository } from '../../users/user.repository';
import { AuthService } from './auth.service';
import { TokenIsAbsentException } from '../exceptions/auth.exeptions';
import { UserNotFoundException } from 'src/module/users/exceptions/user.exceptions';
import { TokenNotValidException } from 'src/common/exceptions/http-error-exception';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../users/user.service';
import { SessionService } from '../../session/session.service';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class TgAuthService extends TokenService {
  // Имя авторизационного TG бота
  private readonly AUTH_TG_BOT: string;

  constructor(
    private prisma: PrismaService,
    configService: ConfigService,
    private authService: AuthService,
    private tgAuthRepo: TgAuthRepository,
    private userRepo: UserRepository,
    jwtService: JwtService,
    userService: UserService,
    sessionService: SessionService,
    authRepo: AuthRepository,
  ) {
    super(jwtService, configService, userService, sessionService, authRepo);
    // Инициализируем значения из ENV с помощью ConfigService
    this.AUTH_TG_BOT = this.configService.get<string>('AUTH_TG_BOT', '');
  }

  // Первичная генерация токена для бота
  public async generateUuid(): Promise<TgBotLinkDto> {
    const uuid = uuidv4();
    await this.tgAuthRepo.store(uuid);

    return { link: `https://t.me/${this.AUTH_TG_BOT}?start=${uuid}` } as TgBotLinkDto;
  }

  // Подтверждение авторизации в боте
  public async confirm(dto: TgBotConfirmDto): Promise<DefaultResponse> {
    return this.prisma.$transaction(async (tx) => {
      // Получим токен
      const records = await this.tgAuthRepo.index({ where: { authKey: dto.authKey } }, tx);
      if (records.length < 1) {
        throw new TokenIsAbsentException();
      }
      const authData = records[0];

      // Получим юзера
      const users = await this.userRepo.index({ where: { telegramId: dto.chatId } }, tx);

      // Такого пользователя нет - создадим
      if (users.length < 1) {
        const userData = await this.userRepo.store({
          login: uuidv4() + '@tg.ru',
          password: uuidv4(),
          name: 'user_' + dto.chatId,
          telegramId: dto.chatId,
          telegramName: dto.chatId,
          roles: [1],
        });

        await this.userRepo.update({
          where: { id: userData.id },
          data: { telegramId: dto.chatId },
        });
      } else {
        const userData = users[0];

        await this.userRepo.update({
          where: { id: userData.id },
          data: { telegramId: dto.chatId },
        });
      }

      // Добавим chat_id
      await this.tgAuthRepo.update({
        where: { id: +authData.id },
        chatId: dto.chatId,
      });

      return { success: true } as DefaultResponse;
    });
  }

  // Авторизация через бота
  public async auth(dto: TgBotLoginDto): Promise<IJwtToken> {
    return this.prisma.$transaction(async (tx) => {
      // Получим токен
      const records = await this.tgAuthRepo.index({ where: { authKey: dto.authKey } }, tx);
      if (records.length < 1) {
        throw new TokenNotValidException();
      }
      const authData = records[0];

      // Ситуация, когда chat_id не успел прописаться
      if (authData.chatId === null) {
        throw new UserNotFoundException();
      }

      // Получим юзера
      const users = await this.userRepo.index({ where: { telegramId: authData.chatId } }, tx);
      if (records.length < 1) {
        throw new UserNotFoundException();
      }
      const userData = users[0];

      // Получим полную информацию о пользователе с ролями
      const user = await this.userService.getUserById(userData.id);
      if (!user) {
        throw new UserNotFoundException();
      }

      // Создадим сессию
      const sessionId = await this.sessionService.createSession(
        user.id.toString(),
        user.roles.map(role => role.name),
        {
          deviceId: 'telegram_' + user.telegramId,
          deviceName: 'Telegram Bot',
          deviceType: 'mobile',
          browser: 'Telegram',
          os: 'Telegram'
        }
      );

      // Создадим токен
      const token = await this.generateToken(user, sessionId);

      return { accessToken: token } as IJwtToken;
    });
  }
}
