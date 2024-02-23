import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { pagination } from '@/application/utils/pagination';
import { Injectable } from '@nestjs/common';

interface FindAllSupportTicketsByResponsibleServiceExecuteProps {
  responsibleId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class FindAllSupportTicketsByResponsibleService {
  constructor(private supportTicketRepository: SupportTicketsRepository) {}

  async execute({
    responsibleId,
    page = 1,
    limit = 10,
  }: FindAllSupportTicketsByResponsibleServiceExecuteProps) {
    const data = await this.supportTicketRepository.findAllByResponsibleUser({
      page,
      pageSize: limit,
      responsibleId,
    });

    const totalCount = await this.supportTicketRepository.totalResponsibleCount(
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
