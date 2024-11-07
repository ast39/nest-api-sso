import { Prisma, Role, UserRole } from '@prisma/client';

export interface IUserRole extends UserRole {
	role?: Role;
}

export type IUserRoleCreate = Prisma.UserRoleCreateInput;
export type IUserRoleUpdate = Prisma.UserRoleUpdateInput;
export type IUserRoleFilter = Prisma.UserRoleWhereInput;
export type IUserRoleUnique = Prisma.UserRoleWhereUniqueInput;
export type IUserRoleOrder = Prisma.UserRoleOrderByWithRelationInput;
