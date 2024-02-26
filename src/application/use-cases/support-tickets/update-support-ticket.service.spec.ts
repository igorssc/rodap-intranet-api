import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { InMemorySupportTicketsRepository } from '@/application/repositories/implementations/in-memory/in-memory-support-tickets.repository';
import { randomUUID } from 'crypto';
import { UpdateSupportTicketService } from './update-support-ticket.service';
import { SupportTicketStatus } from '@prisma/client';

describe('Update Support Ticket Use Case', () => {
  let sut: UpdateSupportTicketService;
  let supportTicketsRepository: SupportTicketsRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateSupportTicketService,
        {
          provide: SupportTicketsRepository,
          useClass: InMemorySupportTicketsRepository,
        },
      ],
    }).compile();

    sut = moduleRef.get(UpdateSupportTicketService);
    supportTicketsRepository = moduleRef.get(SupportTicketsRepository);
  });

  it('should be able to update support ticket', async () => {
    const creatorId = randomUUID();

    const supportTicket = await supportTicketsRepository.create({
      title: 'Ticket of test 01',
      description: 'Description of support ticket 01',
      creator: { connect: { id: creatorId } },
    });

    expect(supportTicket.status).toBe('OPEN');
    expect(supportTicket.title).toBe('Ticket of test 01');

    await sut.execute(supportTicket.id, {
      title: 'Ticket of test',
      status: SupportTicketStatus.PROGRESS,
    });

    const findSupportTickets = await supportTicketsRepository.findById(
      supportTicket.id,
    );

    expect(findSupportTickets.status).toBe('PROGRESS');
    expect(findSupportTickets.title).toBe('Ticket of test');
  });
});
