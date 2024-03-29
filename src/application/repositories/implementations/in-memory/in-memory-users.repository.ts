import { Injectable } from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { FindAllProps, UsersRepository } from '../../users.repository';

@Injectable()
export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];
  public roles: Role[] = [];

  async create(data: Prisma.UserCreateInput) {
    const userCreated = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
      is_admin: data.is_admin ?? false,
      is_active: data.is_active ?? true,
      profile_picture: '',
    };

    this.items.push(userCreated);

    return userCreated;
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);

    const roles = this.roles.filter((role) => role.user_id === user.id);

    if (!user) {
      return null;
    }

    return { ...user, roles };
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id);

    const roles = this.roles.filter((role) => role.user_id === user.id);

    if (!user) {
      return null;
    }

    return { ...user, roles };
  }

  async totalCount() {
    return this.items.length;
  }

  async findAll({ page, pageSize, hiddenId }: FindAllProps) {
    let filteredItems = this.items;

    if (hiddenId) {
      filteredItems = filteredItems.filter((item) => item.id !== hiddenId);
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const data = filteredItems.slice(start, end);

    return data;
  }

  async update(userId: string, user: Prisma.UserUpdateInput) {
    const userIndex = this.items.findIndex((item) => item.id === userId);

    if (userIndex < 0) {
      return null;
    }

    Object.assign(this.items[userIndex], user);

    const roles = this.roles.filter((role) => role.user_id === userId);

    return { ...this.items[userIndex], roles };
  }

  async deleteUnique(userId: string) {
    const userIndex = this.items.findIndex((item) => item.id === userId);

    if (userIndex < 0) {
      return null;
    }

    const userDeleted = { ...this.items[userIndex] };

    this.items.splice(userIndex, 1);

    return userDeleted;
  }
}
