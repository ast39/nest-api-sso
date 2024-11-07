import { Prisma, User } from '@prisma/client';
import { IUserRole } from '../../role/interfaces/user-role.prisma.interface';

export interface IUser extends User {
	roles?: IUserRole[];
}

export type IUserCreate = Prisma.UserCreateInput;
export type IUserUpdate = Prisma.UserUpdateInput;
export type IUserFilter = Prisma.UserWhereInput;
export type IUserUnique = Prisma.UserWhereUniqueInput;
export type IUserOrder = Prisma.UserOrderByWithRelationInput;
