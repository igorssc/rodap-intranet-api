import { UserWithRoles } from '@/application/interfaces/user';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { UsersRepository } from '../users-repository';

@Injectable()
export class InMemoryUsersRepository implements UsersRepository {
  deleteUnique: (userId: string) => Promise<User>;
  public items: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const userCreated = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
      is_admin: false,
      is_active: true,
    };

    this.items.push(userCreated);

    return userCreated;
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id);

    if (!user) {
      return null;
    }

    return { ...user, password_hash: undefined } as UserWithRoles;
  }

  async findAll(page?: number) {
    return this.items.slice(((page ?? 1) - 1) * 20, (page ?? 1) * 20);
  }

  async update(userId: string, user: Prisma.UserUpdateInput) {
    const userIndex = this.items.findIndex((item) => item.id === userId);

    if (userIndex < 0) {
      return null;
    }

    Object.assign(this.items[userIndex], user);

    return { ...this.items[userIndex], password_hash: undefined };
  }
}
