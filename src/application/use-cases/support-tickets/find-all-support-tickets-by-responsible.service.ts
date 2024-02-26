import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { pagination } from '@/application/utils/pagination';
import { Injectable } from '@nestjs/common';

interface FindAllSupportTicketsByResponsibleServiceExecuteProps {
  responsibleId: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class FindAllSupportTicketsByResponsibleService {
  constructor(
    private supportTicketMessagesRepository: SupportTicketsRepository,
  ) {}

  async execute({
    responsibleId,
    page = 1,
    limit = 10,
  }: FindAllSupportTicketsByResponsibleServiceExecuteProps) {
    const data =
      await this.supportTicketMessagesRepository.findAllByResponsibleUser({
        page,
        pageSize: limit,
        responsibleId,
      });

    const totalCount =
      await this.supportTicketMessagesRepository.totalResponsibleCount(
        responsibleId,
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
