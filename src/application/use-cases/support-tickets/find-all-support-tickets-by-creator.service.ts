import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { pagination } from '@/application/utils/pagination';
import { Injectable } from '@nestjs/common';

interface FindAllSupportTicketsByCreatorServiceExecuteProps {
  creatorId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class FindAllSupportTicketsByCreatorService {
  constructor(private supportTicketRepository: SupportTicketsRepository) {}

  async execute({
    creatorId,
    page = 1,
    limit = 10,
  }: FindAllSupportTicketsByCreatorServiceExecuteProps) {
    const data = await this.supportTicketRepository.findAllByCreatorUser({
      page,
      pageSize: limit,
      creatorId,
    });

    const totalCount = await this.supportTicketRepository.totalCreatorCount(
      creatorId,
    );

    const dataPaginated = pagination({
      data,
      page,
      pageSize: limit,
      totalCount,
    });

    return dataPaginated;
  }
}
