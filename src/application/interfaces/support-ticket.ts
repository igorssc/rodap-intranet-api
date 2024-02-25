import { SupportTicket } from '@prisma/client';

export type PartialSupportTicketWithMasterData = Partial<SupportTicket> &
  Pick<SupportTicket, 'id' | 'title'>;
