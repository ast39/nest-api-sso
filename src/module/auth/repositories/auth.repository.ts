import { Injectable } from '@nestjs/common';
import { BlockedToken } from '@prisma/client';
import { IPrismaTR, PrismaService } from 'src/prisma';

@Injectable()
export class AuthRepository {
	constructor(private prisma: PrismaService) {}

	// Проверить наличие токена в черном списке
	async check(token: string, tx?: IPrismaTR): Promise<boolean> {
		const prisma = tx ?? this.prisma;

		const blockedToken = await prisma.blockedToken.findUnique({
			where: { token: token },
		});

		return blockedToken !== null;
	}

	// Добавить токен в черный список
	async store(token: string, tx?: IPrismaTR): Promise<BlockedToken> {
		const prisma = tx ?? this.prisma;

		return prisma.blockedToken.create({
			data: {
				token: token,
			},
		});
	}

	// Удалить токен из черного списка
	async destroy(token: string, tx?: IPrismaTR): Promise<BlockedToken> {
		const prisma = tx ?? this.prisma;

		return prisma.blockedToken.delete({
			where: { token: token },
		});
	}
}
