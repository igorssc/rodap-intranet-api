import { Injectable } from '@nestjs/common';
import { Prisma, SupportTicket, TicketStatus } from '@prisma/client';
import {
  FindAllByCreatorUserProps,
  FindAllByResponsibleUserProps,
  FindAllProps,
  SupportTicketsRepository,
} from '../support-tickets.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class InMemorySupportTicketsRepository
  implements SupportTicketsRepository
{
  public items: SupportTicket[] = [];

  async create(ticket: Prisma.SupportTicketCreateInput) {
    const supportTicketCreated = {
      id: randomUUID(),
      attachment: ticket.attachment,
      creator_id: ticket.creator.connect.id,
      responsible_id: ticket.responsible.connect.id,
      description: ticket.description,
      status: TicketStatus.OPEN,
      ticket_number: this.items.length + 1,
      title: ticket.title,
      created_at: new Date(),
    } as SupportTicket;

    this.items.push(supportTicketCreated);

    return supportTicketCreated;
  }

  async totalCount() {
    return this.items.length;
  }

  async findAll({ page, pageSize }: FindAllProps) {
    const filteredItems = this.items;

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const data = filteredItems.slice(start, end);

    return data;
  }

  async update(ticketId: string, ticket: Prisma.SupportTicketUpdateInput) {
    const ticketIndex = this.items.findIndex((item) => item.id === ticketId);

    if (ticketIndex < 0) {
      return null;
    }

    Object.assign(this.items[ticketIndex], ticket);

    return { ...this.items[ticketIndex] };
  }

  async findAllByCreatorUser({
    creatorId,
    page,
    pageSize,
  }: FindAllByCreatorUserProps) {
    const filteredItems = this.items.filter(
      (action) => action.creator_id === creatorId,
    );

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const data = filteredItems.slice(start, end);

    return data;
  }

  async findAllByResponsibleUser({
    responsibleId,
    page,
    pageSize,
  }: FindAllByResponsibleUserProps) {
    const filteredItems = this.items.filter(
      (action) => action.responsible_id === responsibleId,
    );

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const data = filteredItems.slice(start, end);

    return data;
  }

  async findById(id: string) {
    const tickets = this.items.find((item) => item.id === id);

    if (!tickets) {
      return null;
    }

    return { ...tickets };
  }

  async deleteUnique(ticketId: string) {
    const ticketIndex = this.items.findIndex((item) => item.id === ticketId);

    if (ticketIndex < 0) {
      return null;
    }

    const userDeleted = { ...this.items[ticketIndex] };

    this.items.splice(ticketIndex, 1);

    return userDeleted;
  }
}
