import { Injectable } from '@nestjs/common';
import { CreateActionLogService } from '../create-action-logs.service';
import { User } from '@prisma/client';
import { Expose } from '@/application/providers/prisma/prisma.interface';

interface CreateUserLogServiceExecuteProps {
  actionUserId: string;
  userCreated: Expose<User>;
}

@Injectable()
export class CreateUserLogService {
  constructor(private createActionLogService: CreateActionLogService) {}

  async execute({
    actionUserId,
    userCreated,
  }: CreateUserLogServiceExecuteProps) {
    const { actionLog } = await this.createActionLogService.execute({
      userId: actionUserId,
      action_type: 'UPDATE_USER',
      action_data: {
        userCreated: {
          id: userCreated.id,
          name: userCreated.name,
          email: userCreated.email,
        },
      },
    });

    return { actionLog };
  }
}
