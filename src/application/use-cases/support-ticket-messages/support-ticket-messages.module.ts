import { Module } from '@nestjs/common';
import { SupportTicketMessagesRepository } from '@/application/repositories/support-ticket-messages.repository';
import { PrismaSupportTicketMessagesRepository } from '@/application/repositories/implementations/prisma-support-ticket-messages.repository';
import { CreateMessageFromSupportTicketService } from './create-message-from-support-ticket.service';

@Module({
  imports: [],
  providers: [
    CreateMessageFromSupportTicketService,
    {
      provide: SupportTicketMessagesRepository,
      useClass: PrismaSupportTicketMessagesRepository,
    },
  ],
  exports: [CreateMessageFromSupportTicketService],
})
export class SupportTicketMessagesModule {}
