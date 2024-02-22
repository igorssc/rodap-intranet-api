import { Injectable } from '@nestjs/common';
import { CreateActionLogService } from '../create-action-logs.service';
import { ActionLogType } from '@prisma/client';
import { findDifferentKeys } from '@/application/utils/find-different-keys';
import { PartialUserWithMasterData } from '@/application/interfaces/user';

interface UpdateUserLogServiceExecuteProps {
  actionUserId: string;
  userUpdatedBefore: PartialUserWithMasterData;
  userUpdatedAfter: PartialUserWithMasterData;
}

@Injectable()
export class UpdateMeLogService {
  constructor(private createActionLogService: CreateActionLogService) {}

  async execute({
    actionUserId,
    userUpdatedBefore,
    userUpdatedAfter,
  }: UpdateUserLogServiceExecuteProps) {
    const keysUpdated = findDifferentKeys(userUpdatedBefore, userUpdatedAfter);

    if (keysUpdated.length) {
      const { actionLog } = await this.createActionLogService.execute({
        userId: actionUserId,
        action_type: ActionLogType.UPDATE_PROFILE,
        action_data: {
          updated_values: keysUpdated,
        },
      });

      return { actionLog };
    }

    return {};
  }
}
