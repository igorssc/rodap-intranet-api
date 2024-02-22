import { Injectable } from '@nestjs/common';
import { ActionLog, Prisma } from '@prisma/client';
import {
  ActionLogsRepository,
  FindAllByUserProps,
  FindAllProps,
} from '../action-logs.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class InMemoryActionLogsRepository implements ActionLogsRepository {
  public items: ActionLog[] = [];

  async create(actionLog: Prisma.ActionLogCreateInput) {
    const actionLogCreated = {
      id: randomUUID(),
      action_type: actionLog.action_type,
      action_data: actionLog.action_data,
      created_at: new Date(),
      user_id: actionLog.user.connect.id,
    } as ActionLog;

    this.items.push(actionLogCreated);

    return actionLogCreated;
  }

  async totalCount() {
    return this.items.length;
  }

  async totalUserCount(userId: string) {
    const filteredItems = this.items.filter(
      (action) => action.user_id === userId,
    );

    return filteredItems.length;
  }

  async findAllByUser({ userId, page, pageSize }: FindAllByUserProps) {
    const filteredItems = this.items.filter(
      (action) => action.user_id === userId,
    );

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const data = filteredItems.slice(start, end);

    return data;
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
}
