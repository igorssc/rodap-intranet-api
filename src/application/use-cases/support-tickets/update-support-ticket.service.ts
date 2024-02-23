import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { UpdateSupportTicketDto } from '@/infra/dtos/support-tickets/update-support-ticket.dto';
import { Injectable } from '@nestjs/common';
import { SupportTicket } from '@prisma/client';

interface UpdateSupportTicketUseCaseResponse {
  supportTicket: SupportTicket;
}

@Injectable()
export class UpdateSupportTicketService {
  constructor(private supportTicketRepository: SupportTicketsRepository) {}

  async execute(
    ticketId: string,
    ticket: UpdateSupportTicketDto,
  ): Promise<UpdateSupportTicketUseCaseResponse> {
    const supportTicket = await this.supportTicketRepository.update(ticketId, {
      ...ticket,
    });

    return { supportTicket };
  }
}
