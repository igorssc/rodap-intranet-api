import { Expose } from '@/application/providers/prisma/prisma.interface';
import { PrismaService } from '@/application/providers/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UsersRepository } from '../users-repository';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: Prisma.UserCreateInput): Promise<Expose<User>> {
    const data = await this.prisma.user.create({
      data: { ...user },
    });

    return this.prisma.expose<User>(data);
  }

  async findAll(): Promise<Expose<User>[]> {
    const data = await this.prisma.user.findMany({
      orderBy: { created_at: 'desc' },
    });

    return data.map((currentUser) => this.prisma.expose<User>(currentUser));
  }

  async update(
    userId: string,
    user: Prisma.UserUpdateInput,
  ): Promise<Expose<User>> {
    const data = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: user,
    });

    return await this.prisma.expose<User>(data);
  }
}
