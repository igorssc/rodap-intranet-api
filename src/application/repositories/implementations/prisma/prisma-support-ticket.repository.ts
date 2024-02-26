import { PrismaService } from '@/application/providers/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  FindAllByCreatorUserProps,
  FindAllByResponsibleUserProps,
  FindAllProps,
  SupportTicketsRepository,
} from '../../support-tickets.repository';

@Injectable()
export class PrismaSupportTicketsRepository
  implements SupportTicketsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(ticket: Prisma.SupportTicketCreateInput) {
    const ticketCreated = await this.prisma.supportTicket.create({
      data: { ...ticket },
    });

    return ticketCreated;
  }

  async findById(id: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: {
        id,
      },
    });

    return ticket;
  }

  async totalCount() {
    return await this.prisma.supportTicket.count();
  }

  async totalCreatorCount(creatorId: string) {
    return await this.prisma.supportTicket.count({
      where: { creator_id: creatorId },
    });
  }

  async totalResponsibleCount(responsibleId: string) {
    return await this.prisma.supportTicket.count({
      where: { responsible_id: responsibleId },
    });
  }

  async findAll({ page, pageSize }: FindAllProps) {
    const data = await this.prisma.supportTicket.findMany({
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return data;
  }

  async findAllByResponsibleUser({
    responsibleId,
    page,
    pageSize,
  }: FindAllByResponsibleUserProps) {
    const data = await this.prisma.supportTicket.findMany({
      orderBy: { created_at: 'desc' },
      where: { responsible_id: responsibleId },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return data;
  }

  async findAllByCreatorUser({
    creatorId,
    page,
    pageSize,
  }: FindAllByCreatorUserProps) {
    const data = await this.prisma.supportTicket.findMany({
      orderBy: { created_at: 'desc' },
      where: { creator_id: creatorId },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return data;
  }

  async update(ticketId: string, ticket: Prisma.UserUpdateInput) {
    const data = await this.prisma.supportTicket.update({
      where: {
        id: ticketId,
      },
      data: ticket,
    });

    return data;
  }

  async deleteUnique(ticketId: string) {
    return await this.prisma.supportTicket.delete({ where: { id: ticketId } });
  }
}
