import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { randomUUID } from 'crypto';
import { CreateMessageFromSupportTicketService } from './create-message-from-support-ticket.service';
import { SupportTicketMessagesRepository } from '@/application/repositories/support-ticket-messages.repository';
import { InMemorySupportTicketMessagesRepository } from '@/application/repositories/implementations/in-memory-support-ticket-messages.repository';

describe('Create Message From Support Ticket Use Case', () => {
  let sut: CreateMessageFromSupportTicketService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMessageFromSupportTicketService,
        {
          provide: SupportTicketMessagesRepository,
          useClass: InMemorySupportTicketMessagesRepository,
        },
      ],
    }).compile();

    sut = moduleRef.get(CreateMessageFromSupportTicketService);
  });

  it('should be able to create support ticket message', async () => {
    const senderId = randomUUID();
    const ticketId = randomUUID();

    const { messageSupportTicket } = await sut.execute({
      senderId,
      ticketId,
      message: 'Message of support ticket 01',
    });

    expect(messageSupportTicket.id).toEqual(expect.any(String));
    expect(messageSupportTicket.sender_id).toEqual(senderId);
    expect(messageSupportTicket.ticket_id).toEqual(ticketId);
    expect(messageSupportTicket.message).toEqual(
      'Message of support ticket 01',
    );
  });
});
