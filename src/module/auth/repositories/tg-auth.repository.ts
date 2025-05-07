import { Injectable } from '@nestjs/common';
import { TgAuth } from '@prisma/client';
import { IPrismaTR, PrismaService } from 'src/prisma';
import { ITgAuthFilter, ITgAuthOrder, ITgAuthUnique } from '../interfaces/tg-auth.interface';

@Injectable()
export class TgAuthRepository {
  constructor(private prisma: PrismaService) {}

  // Список токенов
  async index(
    params: {
      skip?: number;
      take?: number;
      where?: ITgAuthFilter;
      orderBy?: ITgAuthOrder;
    },
    tx?: IPrismaTR,
  ): Promise<TgAuth[]> {
    const { skip, take, where, orderBy } = params;
    const prisma = tx ?? this.prisma;

    return prisma.tgAuth.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  // Получить токен
  async show(id: number, tx?: IPrismaTR): Promise<TgAuth> {
    const prisma = tx ?? this.prisma;

    return prisma.tgAuth.findUnique({
      where: { id: id },
    });
  }

  // Добавление токена
  async store(authKey: string, tx?: IPrismaTR): Promise<TgAuth> {
    const prisma = tx ?? this.prisma;

    return prisma.tgAuth.create({
      data: {
        authKey: authKey,
      },
    });
  }

  // Обновление токена
  async update(
    params: {
      where: ITgAuthUnique;
      chatId: string;
    },
    tx?: IPrismaTR,
  ): Promise<TgAuth> {
    const prisma = tx ?? this.prisma;

    return prisma.tgAuth.update({
      where: params.where,
      data: {
        chatId: params.chatId,
      },
    });
  }

  // Удалить токен
  async destroy(where: ITgAuthUnique, tx?: IPrismaTR): Promise<TgAuth> {
    const prisma = tx ?? this.prisma;

    return prisma.tgAuth.delete({
      where: where,
    });
  }
}
