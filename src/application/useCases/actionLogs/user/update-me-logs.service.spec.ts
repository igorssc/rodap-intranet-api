import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryActionLogsRepository } from '@/application/repositories/implementations/in-memory-action-logs.repository';
import { ActionLogsRepository } from '@/application/repositories/action-logs.repository';
import { CreateActionLogService } from '../create-action-logs.service';
import { UpdateMeLogService } from './update-me-logs.service';

describe('Update me logs Use Case', () => {
  let sut: UpdateMeLogService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMeLogService,
        CreateActionLogService,
        {
          provide: ActionLogsRepository,
          useClass: InMemoryActionLogsRepository,
        },
      ],
    }).compile();

    sut = moduleRef.get(UpdateMeLogService);
  });

  it('should be possible to update me creation log', async () => {
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
      actionUserId: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
      userUpdatedBefore,
      userUpdatedAfter,
    });

    expect(actionLog.user_id).toEqual('110ec58a-a0f2-4ac4-8393-c866d813b8d1');

    expect(actionLog.action_type).toEqual('UPDATE_USER');

    expect(actionLog.action_data).toMatchObject({ updated_values: ['name'] });
  });
});
