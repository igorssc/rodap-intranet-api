import { ActionLogsRepository } from '@/application/repositories/action-logs.repository';
import { Injectable } from '@nestjs/common';
import { ActionLog, ActionLogType } from '@prisma/client';

interface CreateActionLogUseCaseResponse {
  actionLog: ActionLog;
}

interface CreateActionLogServiceExecuteProps {
  user_id: string;
  action_type: ActionLogType;
  action_data?: object;
}

@Injectable()
export class CreateActionLogService {
  constructor(private actionLogsRepository: ActionLogsRepository) {}

  async execute({
    user_id,
    action_type,
    action_data = {},
  }: CreateActionLogServiceExecuteProps): Promise<CreateActionLogUseCaseResponse> {
    const actionLog = await this.actionLogsRepository.create({
      action_data,
      action_type,
      user: { connect: { id: user_id } },
    });

    return { actionLog };
  }
}
