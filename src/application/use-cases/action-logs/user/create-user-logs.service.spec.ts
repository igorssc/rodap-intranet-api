import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateUserLogService } from './create-user-logs.service';
import { InMemoryActionLogsRepository } from '@/application/repositories/implementations/in-memory/in-memory-action-logs.repository';
import { ActionLogsRepository } from '@/application/repositories/action-logs.repository';
import { CreateActionLogService } from '../create-action-logs.service';

describe('Create user logs Use Case', () => {
  let sut: CreateUserLogService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserLogService,
        CreateActionLogService,
        {
          provide: ActionLogsRepository,
          useClass: InMemoryActionLogsRepository,
        },
      ],
    }).compile();

    sut = moduleRef.get(CreateUserLogService);
  });

  it('should be possible to add user creation log', async () => {
    const actionUser = {
      id: 'f55fbf7c-8264-4e61-9ced-6c3fe21014ab',
      name: 'alice smith',
      email: 'alicesmith@example.com',
    };

    const userCreated = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'john doe',
      email: 'johndoe@example.com',
    };

    const { actionLog } = await sut.execute({
      actionUser,
      userCreated,
    });

    expect(actionLog.user_id).toEqual(actionUser.id);

    expect(actionLog.action_type).toEqual('CREATE_USER');

    expect(actionLog.action_data).toMatchObject({
      user_created: userCreated,
      action_user: actionUser,
    });
  });
});
