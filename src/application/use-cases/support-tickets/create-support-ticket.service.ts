import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { CreateSupportTicketDto } from '@/infra/dtos/support-tickets/create-support-ticket.dto';
import { Injectable } from '@nestjs/common';
import { SupportTicket } from '@prisma/client';

interface CreateSupportTicketUseCaseResponse {
  supportTicket: SupportTicket;
}

interface CreateSupportTicketServiceExecuteProps
  extends CreateSupportTicketDto {
  userId: string;
}

@Injectable()
export class CreateSupportTicketService {
  constructor(private supportTicketRepository: SupportTicketsRepository) {}

  async execute({
    userId,
    title,
    description,
  }: CreateSupportTicketServiceExecuteProps): Promise<CreateSupportTicketUseCaseResponse> {
    const supportTicket = await this.supportTicketRepository.create({
      title,
      description,
      creator: { connect: { id: userId } },
    });

    return { supportTicket };
  }
}
