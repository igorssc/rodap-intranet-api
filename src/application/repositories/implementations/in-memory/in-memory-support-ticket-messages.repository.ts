import { Injectable } from '@nestjs/common';
import { Prisma, SupportTicketMessage } from '@prisma/client';
import { randomUUID } from 'crypto';
import {
  FindAllByTicketProps,
  SupportTicketMessagesRepository,
} from '../../support-ticket-messages.repository';

@Injectable()
export class InMemorySupportTicketMessagesRepository
  implements SupportTicketMessagesRepository
{
  public items: SupportTicketMessage[] = [];

  async create(message: Prisma.SupportTicketMessageCreateInput) {
    const supportTicketCreated = {
      id: randomUUID(),
      attachment: message.attachment,
      message: message.message,
      sender_id: message.sender.connect.id,
      ticket_id: message.ticket.connect.id,
      created_at: new Date(),
    } as SupportTicketMessage;

    this.items.push(supportTicketCreated);

    return supportTicketCreated;
  }

  async findAllByTicket({ ticketId, page, pageSize }: FindAllByTicketProps) {
    const filteredItems = this.items.filter(
      (action) => action.ticket_id === ticketId,
    );

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const data = filteredItems.slice(start, end);

    return data;
  }
}
