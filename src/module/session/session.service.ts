import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../redis/redis.service';
import { SessionData } from './interfaces/session.interface';
import { DeviceInfoDto } from './dto/device-info.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  private get SESSION_TTL(): number {
    return this.configService.get<number>('SESSION_TTL', 60 * 60 * 24); // 24 часа по умолчанию
  }

  private get MAX_SESSIONS_PER_USER(): number {
    return this.configService.get<number>('MAX_SESSIONS_PER_USER', 5); // 5 сессий по умолчанию
  }

  private get SESSION_PREFIX(): string {
    return this.configService.get<string>('REDIS_SESSION_PREFIX', 'session:');
  }

  private get USER_SESSIONS_PREFIX(): string {
    return this.configService.get<string>('REDIS_USER_SESSIONS_PREFIX', 'user_sessions:');
  }

  // Получает сессию
  async getSession(sessionId: string): Promise<SessionData | null> {
    const sessionData = await this.redisService.get<SessionData>(
      this.getSessionKey(sessionId),
    );

    if (!sessionData) {
      this.logger.debug(`Exception: Session not found [${sessionId}]`);
      return null;
    }

    if (Date.now() > sessionData.expiresAt) {
      this.logger.debug(`Exception: Session  expired [${sessionId}]`);
      await this.deleteSession(sessionId);
      return null;
    }

    return sessionData;
  }

  // Создает сессию
  async createSession(userId: string, roles: string[], deviceInfo: DeviceInfoDto): Promise<string> {
    // Проверяем количество существующих сессий
    const existingSessions = await this.getUserSessions(userId);

    if (existingSessions.length >= this.MAX_SESSIONS_PER_USER) {
      // Удаляем самую старую сессию
      const oldestSession = existingSessions.sort((a, b) => a.createdAt - b.createdAt)[0];
      await this.deleteSession(oldestSession.deviceInfo.deviceId);
    }

    const sessionId = uuidv4();
    const now = Date.now();
    const sessionData: SessionData = {
      userId,
      roles,
      createdAt: now,
      expiresAt: now + this.SESSION_TTL * 1000,
      deviceInfo,
    };

    // Сохраняем сессию
    await this.redisService.set(
      this.getSessionKey(sessionId),
      sessionData,
      this.SESSION_TTL,
    );

    // Добавляем сессию в список сессий пользователя
    await this.addSessionToUser(userId, sessionId);

    return sessionId;
  }

  // Обновляет сессию
  async refreshSession(sessionId: string): Promise<void> {
    const sessionData = await this.getSession(sessionId);
    if (sessionData) {
      const now = Date.now();
      const updatedSessionData: SessionData = {
        ...sessionData,
        expiresAt: now + this.SESSION_TTL * 1000,
      };

      // Обновляем существующую сессию
      await this.redisService.set(
        this.getSessionKey(sessionId),
        updatedSessionData,
        this.SESSION_TTL,
      );
    }
  }

  // Удаляет сессию
  async deleteSession(sessionId: string): Promise<void> {
    const sessionData = await this.getSession(sessionId);
    if (sessionData) {
      // Удаляем сессию
      await this.redisService.del(this.getSessionKey(sessionId));
      
      // Удаляем сессию из списка сессий пользователя
      await this.removeSessionFromUser(sessionData.userId, sessionId);
    }
  }

  // Получает все сессии пользователя
  async getUserSessions(userId: string): Promise<SessionData[]> {
    const sessionIds = await this.redisService.smembers(this.getUserSessionsKey(userId));
    const sessions: SessionData[] = [];
    const invalidSessionIds: string[] = [];

    for (const sessionId of sessionIds) {
      const session = await this.getSession(sessionId);
      if (session) {
        sessions.push(session);
      } else {
        // Если сессия не найдена или истекла, добавляем её ID в список для удаления
        invalidSessionIds.push(sessionId);
      }
    }

    // Если есть неактуальные сессии, удаляем их из списка сессий пользователя
    if (invalidSessionIds.length > 0) {
      this.logger.debug(`Cleaning up ${invalidSessionIds.length} invalid sessions for user ${userId}`);
      // Удаляем каждую неактуальную сессию по отдельности
      for (const sessionId of invalidSessionIds) {
        await this.redisService.srem(this.getUserSessionsKey(userId), sessionId);
      }
    }
  
    return sessions;
  }

  // Удаляет все сессии пользователя
  async deleteAllUserSessions(userId: string): Promise<void> {
    const sessionIds = await this.redisService.smembers(this.getUserSessionsKey(userId));
    
    for (const sessionId of sessionIds) {
      await this.deleteSession(sessionId);
    }
  }

  // Получает ключ сессии
  private getSessionKey(sessionId: string): string {
    return `${this.SESSION_PREFIX}${sessionId}`;
  }
  
  // Получает ключ списка сессий пользователя
  private getUserSessionsKey(userId: string): string {
    return `${this.USER_SESSIONS_PREFIX}${userId}`;
  }

  // Добавляет сессию в список сессий пользователя
  private async addSessionToUser(userId: string, sessionId: string): Promise<void> {
    await this.redisService.sadd(this.getUserSessionsKey(userId), sessionId);
  }

  // Удаляет сессию из списка сессий пользователя
  private async removeSessionFromUser(userId: string, sessionId: string): Promise<void> {
    await this.redisService.srem(this.getUserSessionsKey(userId), sessionId);
  }  
}
