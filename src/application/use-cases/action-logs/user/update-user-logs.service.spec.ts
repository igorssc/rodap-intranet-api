import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryActionLogsRepository } from '@/application/repositories/implementations/in-memory/in-memory-action-logs.repository';
import { ActionLogsRepository } from '@/application/repositories/action-logs.repository';
import { CreateActionLogService } from '../create-action-logs.service';
import { UpdateUserLogService } from './update-user-logs.service';

describe('Update user logs Use Case', () => {
  let sut: UpdateUserLogService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserLogService,
        CreateActionLogService,
        {
          provide: ActionLogsRepository,
          useClass: InMemoryActionLogsRepository,
        },
      ],
    }).compile();

    sut = moduleRef.get(UpdateUserLogService);
  });

  it('should be possible to update user creation log', async () => {
    const actionUser = {
      id: 'f55fbf7c-8264-4e61-9ced-6c3fe21014ab',
      name: 'alice smith',
      email: 'alicesmith@example.com',
    };

    const userUpdatedBefore = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'john',
      email: 'johndoe@example.com',
    };

    const userUpdatedAfter = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'john doe',
      email: 'johndoe@example.com',
    };

    const { actionLog } = await sut.execute({
      actionUser,
      updatedUser: userUpdatedBefore,
      userUpdatedBefore,
      userUpdatedAfter,
    });

    expect(actionLog.user_id).toEqual(actionUser.id);

    expect(actionLog.action_type).toEqual('UPDATE_USER');

    expect(actionLog.action_data).toMatchObject({
      updated_values: ['name'],
      action_user: actionUser,
    });
  });
});
