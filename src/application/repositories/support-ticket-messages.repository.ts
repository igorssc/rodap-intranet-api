import { Prisma, SupportTicketMessage } from '@prisma/client';

export interface FindAllByTicketProps {
  ticketId: string;
  page: number;
  pageSize: number;
}

export abstract class SupportTicketMessagesRepository {
  create: (
    ticket: Prisma.SupportTicketMessageCreateInput,
  ) => Promise<SupportTicketMessage>;

  findAllByTicket: (
    props: FindAllByTicketProps,
  ) => Promise<SupportTicketMessage[]>;
}
