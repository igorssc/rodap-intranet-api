import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { InMemorySupportTicketsRepository } from '@/application/repositories/implementations/in-memory-support-tickets.repository';
import { randomUUID } from 'crypto';
import { FindUniqueSupportTicketService } from './find-unique-support-ticket.service';

describe('Find Unique Support Ticket Use Case', () => {
  let sut: FindUniqueSupportTicketService;
  let supportTicketsRepository: SupportTicketsRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        FindUniqueSupportTicketService,
        {
          provide: SupportTicketsRepository,
          useClass: InMemorySupportTicketsRepository,
        },
      ],
    }).compile();

    sut = moduleRef.get(FindUniqueSupportTicketService);
    supportTicketsRepository = moduleRef.get(SupportTicketsRepository);
  });

  it('should be able to find support ticket by id', async () => {
    const creatorId = randomUUID();

    const supportTicket = await supportTicketsRepository.create({
      title: 'Ticket of test 01',
      description: 'Description of support ticket 01',
      creator: { connect: { id: creatorId } },
    });

    await sut.execute(supportTicket.id);

    expect(supportTicket.title).toBe('Ticket of test 01');
    expect(supportTicket.status).toBe('OPEN');
    expect(supportTicket.creator_id).toBe(creatorId);
  });
});
