import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { InMemorySupportTicketsRepository } from '@/application/repositories/implementations/in-memory-support-tickets.repository';
import { randomUUID } from 'crypto';
import { FindAllSupportTicketsService } from './find-all-support-tickets.service';

describe('Find All Support Tickets Use Case', () => {
  let sut: FindAllSupportTicketsService;
  let supportTicketsRepository: SupportTicketsRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllSupportTicketsService,
        {
          provide: SupportTicketsRepository,
          useClass: InMemorySupportTicketsRepository,
        },
      ],
    }).compile();

    sut = moduleRef.get(FindAllSupportTicketsService);
    supportTicketsRepository = moduleRef.get(SupportTicketsRepository);
  });

  it('should be able to find all support tickets', async () => {
    const creatorId = randomUUID();

    await supportTicketsRepository.create({
      title: 'Ticket of test 01',
      description: 'Description of support ticket 01',
      creator: { connect: { id: creatorId } },
    });

    await supportTicketsRepository.create({
      title: 'Ticket of test 02',
      description: 'Description of support ticket 02',
      creator: { connect: { id: creatorId } },
    });

    const supportTicketsList = await sut.execute();

    const expectedResult = {
      totalDocs: 2,
      limit: 10,
      totalPages: 1,
      page: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };

    Object.keys(expectedResult).forEach((key) =>
      expect(supportTicketsList[key]).toBe(expectedResult[key]),
    );

    expect(supportTicketsList.data[0]?.title).toBe('Ticket of test 01');
    expect(supportTicketsList.data[1]?.title).toBe('Ticket of test 02');
  });

  it('should be able to find all a support tickets on another page', async () => {
    const creatorId = randomUUID();

    await supportTicketsRepository.create({
      title: 'Ticket of test 01',
      description: 'Description of support ticket 01',
      creator: { connect: { id: creatorId } },
    });

    await supportTicketsRepository.create({
      title: 'Ticket of test 02',
      description: 'Description of support ticket 02',
      creator: { connect: { id: creatorId } },
    });

    const supportTicketsList = await sut.execute({ limit: 1, page: 2 });

    const expectedResult = {
      totalDocs: 2,
      limit: 1,
      totalPages: 2,
      page: 2,
      hasPrevPage: true,
      hasNextPage: false,
      prevPage: 1,
      nextPage: null,
    };

    Object.keys(expectedResult).forEach((key) =>
      expect(supportTicketsList[key]).toBe(expectedResult[key]),
    );

    expect(supportTicketsList.data[0]?.title).toBe('Ticket of test 02');
  });
});
