import { SupportTicketMessagesRepository } from '@/application/repositories/support-ticket-messages.repository';
import { CreateSupportTicketMessageDto } from '@/infra/dtos/support-tickets/create-support-ticket-message.dto';
import { Injectable } from '@nestjs/common';
import { SupportTicketMessage } from '@prisma/client';

interface CreateMessageFromSupportTicketUseCaseResponse {
  messageSupportTicket: SupportTicketMessage;
}

interface CreateMessageFromSupportTicketServiceExecuteProps
  extends CreateSupportTicketMessageDto {
  senderId: string;
  ticketId: string;
}

@Injectable()
export class CreateMessageFromSupportTicketService {
  constructor(
    private supportTicketMessagesRepository: SupportTicketMessagesRepository,
  ) {}

  async execute({
    senderId,
    ticketId,
    message,
  }: CreateMessageFromSupportTicketServiceExecuteProps): Promise<CreateMessageFromSupportTicketUseCaseResponse> {
    const messageSupportTicket =
      await this.supportTicketMessagesRepository.create({
        sender: { connect: { id: senderId } },
        ticket: { connect: { id: ticketId } },
        message: message,
      });

    return { messageSupportTicket };
  }
}
