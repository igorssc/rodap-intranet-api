import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { Injectable } from '@nestjs/common';
import { SupportTicket } from '@prisma/client';

interface FindUniqueSupportTicketUseCaseResponse {
  supportTicket: SupportTicket;
}

@Injectable()
export class FindUniqueSupportTicketService {
  constructor(private supportTicketsRepository: SupportTicketsRepository) {}

  async execute(
    ticketId: string,
  ): Promise<FindUniqueSupportTicketUseCaseResponse> {
    const supportTicket = await this.supportTicketsRepository.findById(
      ticketId,
    );

    return { supportTicket };
  }
}
