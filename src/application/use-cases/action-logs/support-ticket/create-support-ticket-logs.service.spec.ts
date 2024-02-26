import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryActionLogsRepository } from '@/application/repositories/implementations/in-memory/in-memory-action-logs.repository';
import { ActionLogsRepository } from '@/application/repositories/action-logs.repository';
import { CreateActionLogService } from '../create-action-logs.service';
import { CreateSupportTicketLogService } from './create-support-ticket-logs.service';

describe('Create support ticket logs Use Case', () => {
  let sut: CreateSupportTicketLogService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSupportTicketLogService,
        CreateActionLogService,
        {
          provide: ActionLogsRepository,
          useClass: InMemoryActionLogsRepository,
        },
      ],
    }).compile();

    sut = moduleRef.get(CreateSupportTicketLogService);
  });

  it('should be possible to add support ticket creation log', async () => {
    const actionUser = {
      id: 'f55fbf7c-8264-4e61-9ced-6c3fe21014ab',
      name: 'alice smith',
      email: 'alicesmith@example.com',
    };

    const ticketCreated = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Title of example 01',
    };

    const { actionLog } = await sut.execute({
      actionUser,
      ticketCreated,
    });

    expect(actionLog.user_id).toEqual(actionUser.id);

    expect(actionLog.action_type).toEqual('CREATE_SUPPORT_TICKET');

    expect(actionLog.action_data).toMatchObject({
      ticket_created: ticketCreated,
      action_user: actionUser,
    });
  });
});
