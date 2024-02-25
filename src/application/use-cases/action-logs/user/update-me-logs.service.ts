import { Injectable } from '@nestjs/common';
import { CreateActionLogService } from '../create-action-logs.service';
import { ActionLog, ActionLogType } from '@prisma/client';
import { findDifferentKeys } from '@/application/utils/find-different-keys';
import { PartialUserWithMasterData } from '@/application/interfaces/user';
import { UpdateMeActionLogsProps } from '@/application/interfaces/action-logs';

interface UpdateUserLogServiceExecuteProps {
  actionUser: PartialUserWithMasterData;
  userUpdatedBefore: PartialUserWithMasterData;
  userUpdatedAfter: PartialUserWithMasterData;
}

interface UpdateMeActionLogUseCaseResponse {
  actionLog: ActionLog & UpdateMeActionLogsProps;
}

@Injectable()
export class UpdateMeLogService {
  constructor(private createActionLogService: CreateActionLogService) {}

  async execute({
    actionUser,
    userUpdatedBefore,
    userUpdatedAfter,
  }: UpdateUserLogServiceExecuteProps) {
    const keysUpdated = findDifferentKeys(userUpdatedBefore, userUpdatedAfter);

    if (keysUpdated.length) {
      const { actionLog } = await this.createActionLogService.execute({
        user_id: actionUser.id,
        action_type: ActionLogType.UPDATE_PROFILE,
        action_data: {
          action_user: {
            id: actionUser.id,
            name: actionUser.name,
            email: actionUser.email,
          },
          updated_values: keysUpdated,
        },
      } as UpdateMeActionLogsProps);

      return { actionLog } as UpdateMeActionLogUseCaseResponse;
    }

    return {} as UpdateMeActionLogUseCaseResponse;
  }
}
