import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryActionLogsRepository } from '@/application/repositories/implementations/in-memory-action-logs.repository';
import { ActionLogsRepository } from '@/application/repositories/action-logs.repository';
import { CreateActionLogService } from '../create-action-logs.service';
import { DeleteUserLogService } from './delete-user-logs.service';

describe('Delete user logs Use Case', () => {
  let sut: DeleteUserLogService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserLogService,
        CreateActionLogService,
        {
          provide: ActionLogsRepository,
          useClass: InMemoryActionLogsRepository,
        },
      ],
    }).compile();

    sut = moduleRef.get(DeleteUserLogService);
  });

  it('should be possible to delete user creation log', async () => {
    const actionUser = {
      id: 'f55fbf7c-8264-4e61-9ced-6c3fe21014ab',
      name: 'alice smith',
      email: 'alicesmith@example.com',
    };

    const userDeleted = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'john doe',
      email: 'johndoe@example.com',
    };

    const { actionLog } = await sut.execute({
      actionUser,
      userDeleted,
    });

    expect(actionLog.user_id).toEqual(actionUser.id);

    expect(actionLog.action_type).toEqual('DELETE_USER');

    expect(actionLog.action_data).toMatchObject({
      user_deleted: userDeleted,
      action_user: actionUser,
    });
  });
});
