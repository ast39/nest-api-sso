import { Injectable } from '@nestjs/common';
import { Attempt } from './interfaces/attempt.interface';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AttemptService {
	// Попытки входа пользователей
	private attempts: Map<string, Attempt> = new Map();

	// Максимальное количество попыток
	private readonly MAX_ATTEMPTS: number;

	// Длительность блокировки в миллисекундах
	private readonly BLOCK_DURATION: number;

	constructor(private configService: ConfigService) {
		// Инициализируем значения из ENV с помощью ConfigService
		this.MAX_ATTEMPTS = Number(this.configService.get<number>('MAX_ATTEMPTS', 5));
		this.BLOCK_DURATION = Number(this.configService.get<number>('BLOCK_DURATION', 15) * 60 * 1000);
	}

	// Обновить попытки входа
	recordAttempt(login: string): void {
		const now = new Date();
		const attempt = this.attempts.get(login) || { count: 0, lastAttempt: now };

		// Если прошло достаточно времени, сбрасываем счетчик
		if (now.getTime() - attempt.lastAttempt.getTime() > this.BLOCK_DURATION) {
			attempt.count = 0;
		}

		attempt.count += 1;
		attempt.lastAttempt = now;

		this.attempts.set(login, attempt);
	}

	// Проверка на блокировку входа
	isBlocked(login: string): boolean {
		const attempt = this.attempts.get(login);
		if (!attempt) {
			return false;
		}

		return attempt.count >= this.MAX_ATTEMPTS;
	}

	// Сброс попыток
	public resetAttempts(login: string): void {
		this.attempts.delete(login);
	}
}
