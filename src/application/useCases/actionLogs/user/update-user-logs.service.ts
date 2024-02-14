import { Injectable } from '@nestjs/common';
import { CreateActionLogService } from '../create-action-logs.service';
import { User } from '@prisma/client';
import { Expose } from '@/application/providers/prisma/prisma.interface';
import { findDifferentKeys } from '@/application/utils/find-different-keys';

interface UpdateUserLogServiceExecuteProps {
  actionUserId: string;
  userUpdatedBefore: Expose<User>;
  userUpdatedAfter: Expose<User>;
}

@Injectable()
export class UpdateUserLogService {
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
        action_type: 'UPDATE_USER',
        action_data: {
          updated_values: keysUpdated,
        },
      });

      return { actionLog };
    }

    return {};
  }
}
