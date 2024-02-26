import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryActionLogsRepository } from '@/application/repositories/implementations/in-memory/in-memory-action-logs.repository';
import { ActionLogsRepository } from '@/application/repositories/action-logs.repository';
import { CreateActionLogService } from '../create-action-logs.service';
import { DeleteSupportTicketLogService } from './delete-support-ticket-logs.service';

describe('Delete support ticket logs Use Case', () => {
  let sut: DeleteSupportTicketLogService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteSupportTicketLogService,
        CreateActionLogService,
        {
          provide: ActionLogsRepository,
          useClass: InMemoryActionLogsRepository,
        },
      ],
    }).compile();

    sut = moduleRef.get(DeleteSupportTicketLogService);
  });

  it('should be possible to delete support ticket creation log', async () => {
    const actionUser = {
      id: 'f55fbf7c-8264-4e61-9ced-6c3fe21014ab',
      name: 'alice smith',
      email: 'alicesmith@example.com',
    };

    const ticketDeleted = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Title of example 01',
    };

    const { actionLog } = await sut.execute({
      actionUser,
      ticketDeleted,
    });

    expect(actionLog.user_id).toEqual(actionUser.id);

    expect(actionLog.action_type).toEqual('DELETE_SUPPORT_TICKET');

    expect(actionLog.action_data).toMatchObject({
      ticket_deleted: ticketDeleted,
      action_user: actionUser,
    });
  });
});
