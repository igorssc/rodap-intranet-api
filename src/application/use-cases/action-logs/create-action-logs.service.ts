import { ActionLogsRepository } from '@/application/repositories/action-logs.repository';
import { CreateActionLogDto } from '@/infra/dtos/action-logs/create-action-log';
import { Injectable } from '@nestjs/common';
import { ActionLog } from '@prisma/client';

interface CreateActionLogUseCaseResponse {
  actionLog: ActionLog;
}

interface CreateActionLogServiceExecuteProps extends CreateActionLogDto {
  userId: string;
}

@Injectable()
export class CreateActionLogService {
  constructor(private actionLogsRepository: ActionLogsRepository) {}

  async execute({
    userId,
    action_type,
    action_data = {},
  }: CreateActionLogServiceExecuteProps): Promise<CreateActionLogUseCaseResponse> {
    const actionLog = await this.actionLogsRepository.create({
      action_data,
      action_type,
      user: { connect: { id: userId } },
    });

    return { actionLog };
  }
}
