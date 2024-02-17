import { PaginatedData } from '@/application/interfaces/pagination';
import { Expose } from '@/application/providers/prisma/prisma.interface';
import { ActionLogsRepository } from '@/application/repositories/action-logs.repository';
import { keysToLowerCase } from '@/application/utils/keys-to-lowe-case';
import { pagination } from '@/application/utils/pagination';
import { Injectable } from '@nestjs/common';
import { ActionLog } from '@prisma/client';

interface FindAllActionLogsServiceExecuteProps {
  hiddenId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class FindAllActionLogsService {
  constructor(private actionLogsRepository: ActionLogsRepository) {}

  async execute({
    page = 1,
    limit = 10,
    hiddenId,
  }: FindAllActionLogsServiceExecuteProps = {}): Promise<
    PaginatedData<Expose<ActionLog>>
  > {
    const data = await this.actionLogsRepository.findAll({
      page,
      pageSize: limit,
      hiddenId,
    });

    let totalCount = await this.actionLogsRepository.totalCount();

    if (hiddenId) {
      const totalUserCount = await this.actionLogsRepository.totalUserCount(
        hiddenId,
      );

      totalCount -= totalUserCount;
    }

    const dataPaginated = pagination({
      data: keysToLowerCase(data),
      page,
      pageSize: limit,
      totalCount,
    });

    return dataPaginated;
  }
}
