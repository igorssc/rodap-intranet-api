import { Prisma, User } from '@prisma/client';
import { UserWithRoles } from '../interfaces/user';

export abstract class UsersRepository {
  create: (user: Prisma.UserCreateInput) => Promise<User>;

  findAll: (page?: number) => Promise<User[]>;

  update: (userId: string, user: Prisma.UserUpdateInput) => Promise<User>;

  findByEmail: (email: string) => Promise<UserWithRoles | null>;

  findById: (id: string) => Promise<UserWithRoles | null>;

  deleteUnique: (userId: string) => Promise<User>;
}
