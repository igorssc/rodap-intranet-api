import { SupportTicketMessagesRepository } from '@/application/repositories/support-ticket-messages.repository';
import { Injectable } from '@nestjs/common';

interface FindAllMessagesByTicketServiceExecuteProps {
  ticketId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class FindAllMessagesBySupportTicketService {
  constructor(
    private supportTicketMessageRepository: SupportTicketMessagesRepository,
  ) {}

  async execute({
    ticketId,
    page = 1,
    limit = 30,
  }: FindAllMessagesByTicketServiceExecuteProps) {
    const data = await this.supportTicketMessageRepository.findAllByTicket({
      page,
      pageSize: limit,
      ticketId,
    });

    const dataPaginated = {
      data,
      page,
      pageSize: limit,
    };

    return dataPaginated;
  }
}
