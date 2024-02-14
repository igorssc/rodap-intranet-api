import { PrismaService } from '@/application/providers/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  ActionLogsRepository,
  FindAllByUserProps,
  FindAllProps,
} from '../action-logs.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaActionLogsRepository implements ActionLogsRepository {
  constructor(private prisma: PrismaService) {}

  async create(actionLog: Prisma.ActionLogCreateInput) {
    const actionLogCreated = await this.prisma.actionLog.create({
      data: { ...actionLog },
    });

    return actionLogCreated;
  }

  async totalCount() {
    return await this.prisma.actionLog.count();
  }

  async totalUserCount(userId: string) {
    return await this.prisma.actionLog.count({ where: { user_id: userId } });
  }

  async findAll({ page, pageSize }: FindAllProps) {
    const data = await this.prisma.actionLog.findMany({
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return data;
  }

  async findAllByUser({ userId, page, pageSize }: FindAllByUserProps) {
    const data = await this.prisma.actionLog.findMany({
      orderBy: { created_at: 'desc' },
      where: {
        user_id: userId,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return data;
  }
}
