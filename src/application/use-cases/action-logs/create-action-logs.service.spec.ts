import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryActionLogsRepository } from '@/application/repositories/implementations/in-memory-action-logs.repository';
import { ActionLogsRepository } from '@/application/repositories/action-logs.repository';
import { CreateActionLogService } from './create-action-logs.service';
import { ActionLogType } from '@prisma/client';

describe('Create user logs Use Case', () => {
  let sut: CreateActionLogService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CreateActionLogService,
        {
          provide: ActionLogsRepository,
          useClass: InMemoryActionLogsRepository,
        },
      ],
    }).compile();

    sut = moduleRef.get(CreateActionLogService);
  });

  it('should be possible to creation log', async () => {
    const userCreated = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'john doe',
      email: 'johndoe@example.com',
    };

    const { actionLog } = await sut.execute({
      action_data: { user_created: userCreated },
      action_type: ActionLogType.CREATE_USER,
      userId: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
    });

    expect(actionLog.user_id).toEqual('110ec58a-a0f2-4ac4-8393-c866d813b8d1');

    expect(actionLog.action_type).toEqual('CREATE_USER');

    expect(actionLog.action_data).toMatchObject({ user_created: userCreated });
  });
});
