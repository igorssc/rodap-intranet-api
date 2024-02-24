import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { randomUUID } from 'crypto';
import { FindAllMessagesBySupportTicketService } from './find-all-messages-by-support-ticket.service';
import { SupportTicketMessagesRepository } from '@/application/repositories/support-ticket-messages.repository';
import { InMemorySupportTicketMessagesRepository } from '@/application/repositories/implementations/in-memory-support-ticket-messages.repository';

describe('Find All Messages by Support Ticket Use Case', () => {
  let sut: FindAllMessagesBySupportTicketService;
  let supportTicketMessagesRepository: SupportTicketMessagesRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllMessagesBySupportTicketService,
        {
          provide: SupportTicketMessagesRepository,
          useClass: InMemorySupportTicketMessagesRepository,
        },
      ],
    }).compile();

    sut = moduleRef.get(FindAllMessagesBySupportTicketService);
    supportTicketMessagesRepository = moduleRef.get(
      SupportTicketMessagesRepository,
    );
  });

  it('should be able to find all messages by support ticket', async () => {
    const senderId = randomUUID();
    const ticketOneId = randomUUID();
    const ticketTwoId = randomUUID();

    await supportTicketMessagesRepository.create({
      sender: { connect: { id: senderId } },
      ticket: { connect: { id: ticketOneId } },
      message: 'Message one of support ticket 01',
    });

    await supportTicketMessagesRepository.create({
      sender: { connect: { id: senderId } },
      ticket: { connect: { id: ticketTwoId } },
      message: 'Message two of support ticket 01',
    });

    const supportTicketMessagesList = await sut.execute({
      ticketId: ticketOneId,
    });

    const expectedResult = {
      limit: 30,
      page: 1,
    };

    Object.keys(expectedResult).forEach((key) =>
      expect(supportTicketMessagesList[key]).toBe(expectedResult[key]),
    );

    expect(supportTicketMessagesList.data[0]?.message).toBe(
      'Message one of support ticket 01',
    );
  });

  it('should be able to find all a messages by support ticket on another page', async () => {
    const senderId = randomUUID();
    const ticketId = randomUUID();

    await supportTicketMessagesRepository.create({
      sender: { connect: { id: senderId } },
      ticket: { connect: { id: ticketId } },
      message: 'Message one of support ticket 01',
    });

    await supportTicketMessagesRepository.create({
      sender: { connect: { id: senderId } },
      ticket: { connect: { id: ticketId } },
      message: 'Message two of support ticket 01',
    });

    await supportTicketMessagesRepository.create({
      sender: { connect: { id: senderId } },
      ticket: { connect: { id: ticketId } },
      message: 'Message three of support ticket 01',
    });

    const supportTicketMessagesList = await sut.execute({
      ticketId,
      limit: 1,
      page: 2,
    });

    const expectedResult = {
      limit: 1,
      page: 2,
    };

    Object.keys(expectedResult).forEach((key) =>
      expect(supportTicketMessagesList[key]).toBe(expectedResult[key]),
    );

    expect(supportTicketMessagesList.data[0]?.message).toBe(
      'Message two of support ticket 01',
    );
  });
});
