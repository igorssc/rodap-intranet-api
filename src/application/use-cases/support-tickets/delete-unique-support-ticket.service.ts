import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { Injectable } from '@nestjs/common';
import { SupportTicket } from '@prisma/client';

@Injectable()
export class DeleteUniqueSupportTicketService {
  constructor(
    private supportTicketMessagesRepository: SupportTicketsRepository,
  ) {}

  async execute(ticketId: string): Promise<SupportTicket> {
    return await this.supportTicketMessagesRepository.deleteUnique(ticketId);
  }
}
