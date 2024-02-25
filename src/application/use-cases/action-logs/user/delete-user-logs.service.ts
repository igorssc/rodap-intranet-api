import { Injectable } from '@nestjs/common';
import { CreateActionLogService } from '../create-action-logs.service';
import { ActionLog, ActionLogType } from '@prisma/client';
import { PartialUserWithMasterData } from '@/application/interfaces/user';
import { DeleteUserActionLogsProps } from '@/application/interfaces/action-logs';

interface DeleteUserLogServiceExecuteProps {
  userDeleted: PartialUserWithMasterData;
  actionUser: PartialUserWithMasterData;
}

interface DeleteActionLogUseCaseResponse {
  actionLog: ActionLog & DeleteUserActionLogsProps;
}

@Injectable()
export class DeleteUserLogService {
  constructor(private createActionLogService: CreateActionLogService) {}

  async execute({ userDeleted, actionUser }: DeleteUserLogServiceExecuteProps) {
    const { actionLog } = await this.createActionLogService.execute({
      user_id: actionUser.id,
      action_type: ActionLogType.DELETE_USER,
      action_data: {
        action_user: {
          id: actionUser.id,
          name: actionUser.name,
          email: actionUser.email,
        },
        user_deleted: {
          id: userDeleted.id,
          name: userDeleted.name,
          email: userDeleted.email,
        },
      },
    } as DeleteUserActionLogsProps);

    return { actionLog } as DeleteActionLogUseCaseResponse;
  }
}
