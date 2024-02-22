import { PrismaSupportTicketsRepository } from '@/application/repositories/implementations/prisma-support-ticket.repository';
import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { Module } from '@nestjs/common';
import { CreateMessageFromSupportTicketService } from './create-message-from-support-ticket.service';
import { CreateSupportTicketService } from './create-support-ticket.service';
import { DeleteUniqueSupportTicketService } from './delete-unique-support-ticket.service';
import { FindAllSupportTicketsByCreatorService } from './find-all-support-tickets-by-creator.service';
import { FindAllSupportTicketsByResponsibleService } from './find-all-support-tickets-by-responsible.service';
import { FindAllSupportTicketsService } from './find-all-support-tickets.service';

@Module({
  imports: [],
  providers: [
    CreateMessageFromSupportTicketService,
    CreateSupportTicketService,
    DeleteUniqueSupportTicketService,
    FindAllSupportTicketsByCreatorService,
    FindAllSupportTicketsByResponsibleService,
    FindAllSupportTicketsService,
    {
      provide: SupportTicketsRepository,
      useClass: PrismaSupportTicketsRepository,
    },
  ],
  exports: [
    CreateMessageFromSupportTicketService,
    CreateSupportTicketService,
    DeleteUniqueSupportTicketService,
    FindAllSupportTicketsByCreatorService,
    FindAllSupportTicketsByResponsibleService,
    FindAllSupportTicketsService,
    SupportTicketsRepository,
  ],
})
export class SupportTicketsModule {}
