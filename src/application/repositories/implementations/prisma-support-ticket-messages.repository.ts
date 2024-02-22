import { PrismaService } from '@/application/providers/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  FindAllByTicketProps,
  SupportTicketMessagesRepository,
} from '../support-ticket-messages.repository';

@Injectable()
export class PrismaSupportTicketMessagesRepository
  implements SupportTicketMessagesRepository
{
  constructor(private prisma: PrismaService) {}

  async create(ticket: Prisma.SupportTicketMessageCreateInput) {
    const ticketCreated = await this.prisma.supportTicketMessage.create({
      data: { ...ticket },
    });

    return ticketCreated;
  }

  async findAllByTicket({ ticketId, page, pageSize }: FindAllByTicketProps) {
    const data = await this.prisma.supportTicketMessage.findMany({
      orderBy: { created_at: 'desc' },
      where: { ticket_id: ticketId },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return data;
  }
}
