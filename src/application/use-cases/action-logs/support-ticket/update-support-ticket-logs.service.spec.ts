import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateSupportTicketLogService } from './update-support-ticket-logs.service';
import { InMemoryActionLogsRepository } from '@/application/repositories/implementations/in-memory-action-logs.repository';
import { ActionLogsRepository } from '@/application/repositories/action-logs.repository';
import { CreateActionLogService } from '../create-action-logs.service';

describe('Update support ticket logs Use Case', () => {
  let sut: UpdateSupportTicketLogService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateSupportTicketLogService,
        CreateActionLogService,
        {
          provide: ActionLogsRepository,
          useClass: InMemoryActionLogsRepository,
        },
      ],
    }).compile();

    sut = moduleRef.get(UpdateSupportTicketLogService);
  });

  it('should be possible to update support ticket creation log', async () => {
    const actionUser = {
      id: 'f55fbf7c-8264-4e61-9ced-6c3fe21014ab',
      name: 'alice smith',
      email: 'alicesmith@example.com',
    };

    const ticketUpdatedBefore = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Title example 01',
    };

    const ticketUpdatedAfter = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Title of example 01',
    };

    const { actionLog } = await sut.execute({
      actionUser,
      ticketUpdated: ticketUpdatedBefore,
      ticketUpdatedBefore,
      ticketUpdatedAfter,
    });

    expect(actionLog.user_id).toEqual(actionUser.id);

    expect(actionLog.action_type).toEqual('UPDATE_SUPPORT_TICKET');

    expect(actionLog.action_data).toMatchObject({
      updated_values: ['title'],
      action_user: actionUser,
    });
  });
});
