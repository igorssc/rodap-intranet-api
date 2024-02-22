import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteUniqueSupportTicketService {
  constructor(private supportTicketRepository: SupportTicketsRepository) {}

  async execute() {
    return {};
  }
}
