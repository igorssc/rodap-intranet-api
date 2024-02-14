import { PrismaService } from '@/application/providers/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FindAllProps, UsersRepository } from '../users.repository';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: Prisma.UserCreateInput) {
    const userCreated = await this.prisma.user.create({
      data: { ...user },
    });

    return userCreated;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        roles: true,
      },
    });

    return user;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        roles: true,
      },
    });

    return user;
  }

  async totalCount() {
    return await this.prisma.user.count();
  }

  async findAll({ page, pageSize, hiddenId }: FindAllProps) {
    const data = await this.prisma.user.findMany({
      orderBy: { created_at: 'desc' },
      where: {
        NOT: {
          id: hiddenId,
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return data;
  }

  async update(userId: string, user: Prisma.UserUpdateInput) {
    const data = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: user,
      include: {
        roles: true,
      },
    });

    return data;
  }

  async deleteUnique(userId: string) {
    return await this.prisma.user.delete({ where: { id: userId } });
  }
}
