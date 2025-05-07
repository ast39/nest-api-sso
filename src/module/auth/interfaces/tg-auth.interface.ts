import { Prisma, TgAuth } from '@prisma/client';

export interface ITgAuth extends TgAuth {}

export type ITgAuthCreate = Prisma.TgAuthCreateInput;
export type ITgAuthUpdate = Prisma.TgAuthUpdateInput;
export type ITgAuthFilter = Prisma.TgAuthWhereInput;
export type ITgAuthUnique = Prisma.TgAuthWhereUniqueInput;
export type ITgAuthOrder = Prisma.TgAuthOrderByWithRelationInput;
