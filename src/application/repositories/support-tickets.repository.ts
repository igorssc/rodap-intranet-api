import { Prisma, SupportTicket } from '@prisma/client';

export interface FindAllProps {
  page: number;
  pageSize: number;
}

export interface FindAllByCreatorUserProps {
  creatorId: string;
  page: number;
  pageSize: number;
}

export interface FindAllByResponsibleUserProps {
  responsibleId: string;
  page: number;
  pageSize: number;
}

export abstract class SupportTicketsRepository {
  create: (ticket: Prisma.SupportTicketCreateInput) => Promise<SupportTicket>;

  totalCount: () => Promise<number>;

  findAll: (props: FindAllProps) => Promise<SupportTicket[]>;

  update: (
    ticketId: string,
    ticket: Prisma.SupportTicketUpdateInput,
  ) => Promise<SupportTicket>;

  findAllByCreatorUser: (
    props: FindAllByCreatorUserProps,
  ) => Promise<SupportTicket[]>;

  findAllByResponsibleUser: (
    props: FindAllByResponsibleUserProps,
  ) => Promise<SupportTicket[]>;

  findById: (id: string) => Promise<SupportTicket>;

  deleteUnique: (ticketId: string) => Promise<SupportTicket>;

  totalCreatorCount: (creatorId: string) => Promise<number>;

  totalResponsibleCount: (responsibleId: string) => Promise<number>;
}
