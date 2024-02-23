import { Module } from '@nestjs/common';
import { SupportTicketMessagesRepository } from '@/application/repositories/support-ticket-messages.repository';
import { PrismaSupportTicketMessagesRepository } from '@/application/repositories/implementations/prisma-support-ticket-messages.repository';
import { CreateMessageFromSupportTicketService } from './create-message-from-support-ticket.service';
import { PrismaService } from '@/application/providers/prisma/prisma.service';
import { FindAllMessagesBySupportTicketService } from './find-all-messages-by-support-ticket.service';

@Module({
  imports: [],
  providers: [
    CreateMessageFromSupportTicketService,
    FindAllMessagesBySupportTicketService,
    PrismaService,
    {
      provide: SupportTicketMessagesRepository,
      useClass: PrismaSupportTicketMessagesRepository,
    },
  ],
  exports: [
    CreateMessageFromSupportTicketService,
    FindAllMessagesBySupportTicketService,
    SupportTicketMessagesRepository,
  ],
})
export class SupportTicketMessagesModule {}
