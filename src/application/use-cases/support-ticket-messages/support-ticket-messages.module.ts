import { Module } from '@nestjs/common';
import { SupportTicketMessagesRepository } from '@/application/repositories/support-ticket-messages.repository';
import { PrismaSupportTicketMessagesRepository } from '@/application/repositories/implementations/prisma-support-ticket-messages.repository';
import { CreateMessageFromSupportTicketService } from './create-message-from-support-ticket.service';
import { FindAllMessagesByTicketService } from './find-all-messages-by-ticket.service';
import { PrismaService } from '@/application/providers/prisma/prisma.service';

@Module({
  imports: [],
  providers: [
    CreateMessageFromSupportTicketService,
    FindAllMessagesByTicketService,
    PrismaService,
    {
      provide: SupportTicketMessagesRepository,
      useClass: PrismaSupportTicketMessagesRepository,
    },
  ],
  exports: [
    CreateMessageFromSupportTicketService,
    FindAllMessagesByTicketService,
    SupportTicketMessagesRepository,
  ],
})
export class SupportTicketMessagesModule {}
