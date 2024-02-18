import { Injectable } from '@nestjs/common';
import { CreateActionLogService } from '../create-action-logs.service';
import { ActionLogType } from '@prisma/client';
import { findDifferentKeys } from '@/application/utils/find-different-keys';
import { PartialUserWithMasterData } from '@/application/interfaces/user';

interface UpdateUserLogServiceExecuteProps {
  updatedUser: PartialUserWithMasterData;
  userUpdatedBefore: PartialUserWithMasterData;
  userUpdatedAfter: PartialUserWithMasterData;
  actionUser: PartialUserWithMasterData;
}

@Injectable()
export class UpdateUserLogService {
  constructor(private createActionLogService: CreateActionLogService) {}

  async execute({
    updatedUser,
    actionUser,
    userUpdatedBefore,
    userUpdatedAfter,
  }: UpdateUserLogServiceExecuteProps) {
    const keysUpdated = findDifferentKeys(userUpdatedBefore, userUpdatedAfter);

    if (keysUpdated.length) {
      const { actionLog } = await this.createActionLogService.execute({
        userId: actionUser.id,
        action_type: ActionLogType.UPDATE_USER,
        action_data: {
          action_user: {
            id: actionUser.id,
            name: actionUser.name,
            email: actionUser.email,
          },
          user_updated: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
          },
          updated_values: keysUpdated,
        },
      });

      return { actionLog };
    }

    return {};
  }
}
