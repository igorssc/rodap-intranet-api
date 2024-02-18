import { Injectable } from '@nestjs/common';
import { CreateActionLogService } from '../create-action-logs.service';
import { ActionLogType } from '@prisma/client';
import { PartialUserWithMasterData } from '@/application/interfaces/user';

interface CreateUserLogServiceExecuteProps {
  userCreated: PartialUserWithMasterData;
  actionUser: PartialUserWithMasterData;
}

@Injectable()
export class CreateUserLogService {
  constructor(private createActionLogService: CreateActionLogService) {}

  async execute({ userCreated, actionUser }: CreateUserLogServiceExecuteProps) {
    const { actionLog } = await this.createActionLogService.execute({
      userId: actionUser.id,
      action_type: ActionLogType.CREATE_USER,
      action_data: {
        action_user: {
          id: actionUser.id,
          name: actionUser.name,
          email: actionUser.email,
        },
        user_created: {
          id: userCreated.id,
          name: userCreated.name,
          email: userCreated.email,
        },
      },
    });

    return { actionLog };
  }
}
