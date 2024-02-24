import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { InMemorySupportTicketsRepository } from '@/application/repositories/implementations/in-memory-support-tickets.repository';
import { randomUUID } from 'crypto';
import { DeleteUniqueSupportTicketService } from './delete-unique-support-ticket.service';

describe('Delete Support Ticket Use Case', () => {
  let sut: DeleteUniqueSupportTicketService;
  let supportTicketsRepository: SupportTicketsRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUniqueSupportTicketService,
        {
          provide: SupportTicketsRepository,
          useClass: InMemorySupportTicketsRepository,
        },
      ],
    }).compile();

    sut = moduleRef.get(DeleteUniqueSupportTicketService);
    supportTicketsRepository = moduleRef.get(SupportTicketsRepository);
  });

  it('should be able to delete support ticket', async () => {
    const creatorId = randomUUID();

    const supportTicket = await supportTicketsRepository.create({
      title: 'Ticket of test 01',
      description: 'Description of support ticket 01',
      creator: { connect: { id: creatorId } },
    });

    const findAllSupportTicketsBeforeDeletion =
      await supportTicketsRepository.findAll({ page: 1, pageSize: 10 });

    expect(findAllSupportTicketsBeforeDeletion).toHaveLength(1);

    await sut.execute(supportTicket.id);

    const findAllSupportTicketsAfterDeletion =
      await supportTicketsRepository.findAll({ page: 1, pageSize: 10 });

    expect(findAllSupportTicketsAfterDeletion).toHaveLength(0);
  });
});
