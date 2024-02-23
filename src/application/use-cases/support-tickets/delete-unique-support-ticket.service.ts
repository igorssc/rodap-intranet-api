import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { Injectable } from '@nestjs/common';
import { SupportTicket } from '@prisma/client';

@Injectable()
export class DeleteUniqueSupportTicketService {
  constructor(private supportTicketRepository: SupportTicketsRepository) {}

  async execute(ticketId: string): Promise<SupportTicket> {
    return await this.supportTicketRepository.deleteUnique(ticketId);
  }
}
