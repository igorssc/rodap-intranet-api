import { Prisma, User } from '@prisma/client';
import { Expose } from '../providers/prisma/prisma.interface';

export abstract class UsersRepository {
  create: (user: Prisma.UserCreateInput) => Promise<User>;

  findAll: (page?: number) => Promise<Expose<User>[]>;

  update: (
    userId: string,
    user: Prisma.UserUpdateInput,
  ) => Promise<Expose<User>>;

  findByEmail: (email: string) => Promise<User | null>;

  findById: (id: string) => Promise<User | null>;
}
