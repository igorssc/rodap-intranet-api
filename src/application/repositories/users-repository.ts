import { Prisma, User } from '@prisma/client';
import { Expose } from '../providers/prisma/prisma.interface';

export abstract class UsersRepository {
  create: (user: Prisma.UserCreateInput) => Promise<Expose<User>>;

  findAll: () => Promise<Expose<User>[]>;

  update: (
    userId: string,
    user: Prisma.UserUpdateInput,
  ) => Promise<Expose<User>>;
}
