import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryActionLogsRepository } from '@/application/repositories/implementations/in-memory-action-logs.repository';
import { ActionLogsRepository } from '@/application/repositories/action-logs.repository';
import { CreateActionLogService } from './create-action-logs.service';
import { ActionLogType } from '@prisma/client';
import { FindAllActionLogsService } from './find-all-action-logs.service';

describe('Find all action Logs Use Case', () => {
  let sut: FindAllActionLogsService;
  let actionLogsRepository: ActionLogsRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllActionLogsService,
        CreateActionLogService,
        {
          provide: ActionLogsRepository,
          useClass: InMemoryActionLogsRepository,
        },
      ],
    }).compile();

    actionLogsRepository = moduleRef.get(ActionLogsRepository);
    sut = moduleRef.get(FindAllActionLogsService);
  });

  it('should be possible to find action logs by user', async () => {
    const userCreated = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'john doe',
      email: 'johndoe@example.com',
    };

    await actionLogsRepository.create({
      action_data: { user_created: userCreated },
      action_type: ActionLogType.CREATE_USER,
      User: { connect: { id: '110ec58a-a0f2-4ac4-8393-c866d813b8d1' } },
    });

    const listActionLogs = await sut.execute();

    const expectedResult = {
      totalDocs: 1,
      limit: 10,
      totalPages: 1,
      page: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };

    Object.keys(expectedResult).forEach((key) =>
      expect(listActionLogs[key]).toBe(expectedResult[key]),
    );

    expect(listActionLogs.data).toHaveLength(1);

    expect(listActionLogs.data[0].user_id).toEqual(
      '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
    );

    expect(listActionLogs.data[0].action_type).toEqual(
      ActionLogType.CREATE_USER,
    );

    expect(listActionLogs.data[0].action_data).toMatchObject({
      user_created: userCreated,
    });
  });

  it('should be possible to find all action logs on another page', async () => {
    const userOneCreated = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'john doe',
      email: 'johndoe@example.com',
    };

    await actionLogsRepository.create({
      action_data: { user_created: userOneCreated },
      action_type: ActionLogType.CREATE_USER,
      User: { connect: { id: '110ec58a-a0f2-4ac4-8393-c866d813b8d1' } },
    });

    const userTwoCreated = {
      id: '1b284e1b-2903-4fcc-a20a-fc11fe17bf4b',
      name: 'Alice Smith',
      email: 'alicesmith@example.com',
    };

    await actionLogsRepository.create({
      action_data: { user_created: userTwoCreated },
      action_type: ActionLogType.CREATE_USER,
      User: { connect: { id: '110ec58a-a0f2-4ac4-8393-c866d813b8d1' } },
    });

    const listActionLogs = await sut.execute({
      limit: 1,
      page: 2,
    });

    const expectedResult = {
      totalDocs: 2,
      limit: 1,
      totalPages: 2,
      page: 2,
      hasPrevPage: true,
      hasNextPage: false,
      prevPage: 1,
      nextPage: null,
    };

    Object.keys(expectedResult).forEach((key) =>
      expect(listActionLogs[key]).toBe(expectedResult[key]),
    );

    expect(listActionLogs.data).toHaveLength(1);

    expect(listActionLogs.data[0].user_id).toEqual(
      '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
    );

    expect(listActionLogs.data[0].action_type).toEqual(
      ActionLogType.CREATE_USER,
    );

    expect(listActionLogs.data[0].action_data).toMatchObject({
      user_created: userTwoCreated,
    });
  });
});
