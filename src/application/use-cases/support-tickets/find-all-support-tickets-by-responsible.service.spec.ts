import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SupportTicketsRepository } from '@/application/repositories/support-tickets.repository';
import { InMemorySupportTicketsRepository } from '@/application/repositories/implementations/in-memory-support-tickets.repository';
import { randomUUID } from 'crypto';
import { FindAllSupportTicketsByResponsibleService } from './find-all-support-tickets-by-responsible.service';

describe('Find All Support Tickets By Responsible Use Case', () => {
  let sut: FindAllSupportTicketsByResponsibleService;
  let supportTicketsRepository: SupportTicketsRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllSupportTicketsByResponsibleService,
        {
          provide: SupportTicketsRepository,
          useClass: InMemorySupportTicketsRepository,
        },
      ],
    }).compile();

    sut = moduleRef.get(FindAllSupportTicketsByResponsibleService);
    supportTicketsRepository = moduleRef.get(SupportTicketsRepository);
  });

  it('should be able to find all support tickets by responsible', async () => {
    const creatorId = randomUUID();
    const responsibleId = randomUUID();

    const supportTicket = await supportTicketsRepository.create({
      title: 'Ticket of test 01',
      description: 'Description of support ticket 01',
      creator: { connect: { id: creatorId } },
    });

    await supportTicketsRepository.create({
      title: 'Ticket of test 02',
      description: 'Description of support ticket 02',
      creator: { connect: { id: creatorId } },
    });

    await supportTicketsRepository.update(supportTicket.id, {
      responsible: { connect: { id: responsibleId } },
    });

    const supportTicketList = await sut.execute({
      responsibleId,
    });

    const expectedResult = {
      totalDocs: 1,
      limit: 10,
      totalPages: 1,
      page: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };

    Object.keys(expectedResult).forEach((key) =>
      expect(supportTicketList[key]).toBe(expectedResult[key]),
    );

    expect(supportTicketList.data[0]?.title).toBe('Ticket of test 01');
  });

  it('should be able to find all a support tickets by responsible on another page', async () => {
    const creatorId = randomUUID();
    const responsibleId = randomUUID();

    const supportTicketOne = await supportTicketsRepository.create({
      title: 'Ticket of test 01',
      description: 'Description of support ticket 01',
      creator: { connect: { id: creatorId } },
    });

    const supportTicketTwo = await supportTicketsRepository.create({
      title: 'Ticket of test 02',
      description: 'Description of support ticket 02',
      creator: { connect: { id: creatorId } },
    });

    await supportTicketsRepository.update(supportTicketOne.id, {
      responsible: { connect: { id: responsibleId } },
    });

    await supportTicketsRepository.update(supportTicketTwo.id, {
      responsible: { connect: { id: responsibleId } },
    });

    const supportTicketList = await sut.execute({
      responsibleId,
      limit: 1,
      page: 2,
    });

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
      expect(supportTicketList[key]).toBe(expectedResult[key]),
    );

    expect(supportTicketList.data[0]?.title).toBe('Ticket of test 02');
  });
});
