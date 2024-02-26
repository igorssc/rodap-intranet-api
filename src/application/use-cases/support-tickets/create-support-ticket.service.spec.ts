import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateSupportTicketService } from './create-support-ticket.service';
import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { InMemorySupportTicketsRepository } from '@/application/repositories/implementations/in-memory/in-memory-support-tickets.repository';
import { randomUUID } from 'crypto';

describe('Create Support Ticket Use Case', () => {
  let sut: CreateSupportTicketService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSupportTicketService,
        {
          provide: SupportTicketsRepository,
          useClass: InMemorySupportTicketsRepository,
        },
      ],
    }).compile();

    sut = moduleRef.get(CreateSupportTicketService);
  });

  it('should be able to create support ticket', async () => {
    const userId = randomUUID();

    const { supportTicket } = await sut.execute({
      title: 'Ticket of test 01',
      description: 'Description of support ticket 01',
      userId,
    });

    expect(supportTicket.id).toEqual(expect.any(String));
    expect(supportTicket.title).toEqual('Ticket of test 01');
    expect(supportTicket.description).toEqual(
      'Description of support ticket 01',
    );
    expect(supportTicket.creator_id).toEqual(userId);
  });
});
