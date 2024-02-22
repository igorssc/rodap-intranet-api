import { PrismaSupportTicketsRepository } from '@/application/repositories/implementations/prisma-support-ticket.repository';
import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [
    {
      provide: SupportTicketsRepository,
      useClass: PrismaSupportTicketsRepository,
    },
  ],
  exports: [],
})
export class SupportTicketsModule {}
