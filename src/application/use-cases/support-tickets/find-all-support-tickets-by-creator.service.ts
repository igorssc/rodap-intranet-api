import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { pagination } from '@/application/utils/pagination';
import { Injectable } from '@nestjs/common';

interface FindAllSupportTicketsByCreatorServiceExecuteProps {
  creatorId: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class FindAllSupportTicketsByCreatorService {
  constructor(
    private supportTicketMessagesRepository: SupportTicketsRepository,
  ) {}

  async execute({
    creatorId,
    page = 1,
    limit = 10,
  }: FindAllSupportTicketsByCreatorServiceExecuteProps) {
    const data =
      await this.supportTicketMessagesRepository.findAllByCreatorUser({
        page,
        pageSize: limit,
        creatorId,
      });

    const totalCount =
      await this.supportTicketMessagesRepository.totalCreatorCount(creatorId);

    const dataPaginated = pagination({
      data,
      page,
      pageSize: limit,
      totalCount,
    });

    return dataPaginated;
  }
}
