import { ActionLogsRepository } from '@/application/repositories/action-logs.repository';
import { pagination } from '@/application/utils/pagination';
import { Injectable } from '@nestjs/common';

interface FindActionLogsByUserServiceExecuteProps {
  userId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class FindActionLogsByUserService {
  constructor(private actionLogsRepository: ActionLogsRepository) {}

  async execute({
    userId,
    page = 1,
    limit = 10,
  }: FindActionLogsByUserServiceExecuteProps) {
    const data = await this.actionLogsRepository.findAllByUser({
      page,
      pageSize: limit,
      userId,
    });

    const dataPaginated = pagination({
      data,
      page,
      pageSize: limit,
      totalCount: 1,
    });

    return dataPaginated;
  }
}
