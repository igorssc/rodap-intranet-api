import { PrismaSupportTicketsRepository } from '@/application/repositories/implementations/prisma-support-ticket.repository';
import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { Module } from '@nestjs/common';
import { CreateSupportTicketService } from './create-support-ticket.service';
import { DeleteUniqueSupportTicketService } from './delete-unique-support-ticket.service';
import { FindAllSupportTicketsByCreatorService } from './find-all-support-tickets-by-creator.service';
import { FindAllSupportTicketsByResponsibleService } from './find-all-support-tickets-by-responsible.service';
import { FindAllSupportTicketsService } from './find-all-support-tickets.service';
import { PrismaService } from '@/application/providers/prisma/prisma.service';
import { FindUniqueSupportTicketService } from './find-unique-support-ticket.service';
import { UpdateSupportTicketService } from './update-support-ticket.service';

@Module({
  imports: [],
  providers: [
    CreateSupportTicketService,
    DeleteUniqueSupportTicketService,
    FindAllSupportTicketsByCreatorService,
    FindAllSupportTicketsByResponsibleService,
    FindAllSupportTicketsService,
    FindUniqueSupportTicketService,
    UpdateSupportTicketService,
    PrismaService,
    {
      provide: SupportTicketsRepository,
      useClass: PrismaSupportTicketsRepository,
    },
  ],
  exports: [
    CreateSupportTicketService,
    DeleteUniqueSupportTicketService,
    FindAllSupportTicketsByCreatorService,
    FindAllSupportTicketsByResponsibleService,
    FindAllSupportTicketsService,
    SupportTicketsRepository,
    FindUniqueSupportTicketService,
    UpdateSupportTicketService,
  ],
})
export class SupportTicketsModule {}
