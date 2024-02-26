import { PaginatedData } from '@/application/interfaces/pagination';
import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { pagination } from '@/application/utils/pagination';
import { Injectable } from '@nestjs/common';
import { SupportTicket } from '@prisma/client';

interface FindAllSupportTicketsServiceExecuteProps {
  page?: number;
  limit?: number;
}

@Injectable()
export class FindAllSupportTicketsService {
  constructor(
    private supportTicketMessagesRepository: SupportTicketsRepository,
  ) {}

  async execute({
    limit = 10,
    page = 1,
  }: FindAllSupportTicketsServiceExecuteProps = {}): Promise<
    PaginatedData<SupportTicket>
  > {
    const data = await this.supportTicketMessagesRepository.findAll({
      page,
      pageSize: limit,
    });

    const totalCount = await this.supportTicketMessagesRepository.totalCount();

    const dataPaginated = pagination({
      data,
      page,
      pageSize: limit,
      totalCount,
    });

    return dataPaginated;
  }
}
