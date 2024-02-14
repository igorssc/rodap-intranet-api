import { Prisma, User } from '@prisma/client';
import { UserWithRoles } from '../interfaces/user';

export interface FindAllProps {
  page: number;
  pageSize: number;
  hiddenId?: string;
}

export abstract class UsersRepository {
  create: (user: Prisma.UserCreateInput) => Promise<User>;

  totalCount: () => Promise<number>;

  findAll: (props: FindAllProps) => Promise<User[]>;

  update: (userId: string, user: Prisma.UserUpdateInput) => Promise<User>;

  findByEmail: (email: string) => Promise<UserWithRoles | null>;

  findById: (id: string) => Promise<UserWithRoles | null>;

  deleteUnique: (userId: string) => Promise<User>;
}
