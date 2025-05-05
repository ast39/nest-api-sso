import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly redis: Redis;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService
  ) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });

    this.redis.on('error', (error) => {
      this.logger.error('Redis connection error:', error);
    });
  }

  // Получает значение из кэша
  async get<T>(key: string): Promise<T | undefined> {
    const value = await this.cacheManager.get<T>(key);
    return value;
  }

  // Устанавливает значение в кэш
  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  // Удаляет значение из кэша
  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  // Удаляет все значения из кэша
  async reset(): Promise<void> {
    await this.cacheManager.del('*');
  }

  // Получение значения
  async getRedis<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  // Установка значения
  async setRedis(key: string, value: any, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await this.redis.setex(key, ttl, stringValue);
    } else {
      await this.redis.set(key, stringValue);
    }
  }

  // Удаление значения
  async delRedis(key: string): Promise<void> {
    await this.redis.del(key);
  }

  // Добавление элемента в множество
  async sadd(key: string, member: string): Promise<void> {
    await this.redis.sadd(key, member);
  }

  // Удаление элемента из множества
  async srem(key: string, member: string): Promise<void> {
    await this.redis.srem(key, member);
  }

  // Получение всех элементов множества
  async smembers(key: string): Promise<string[]> {
    return await this.redis.smembers(key);
  }

  // Проверка существования элемента в множестве
  async sismember(key: string, member: string): Promise<boolean> {
    return (await this.redis.sismember(key, member)) === 1;
  }
}
