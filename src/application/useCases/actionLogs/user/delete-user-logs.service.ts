import { Injectable } from '@nestjs/common';
import { CreateActionLogService } from '../create-action-logs.service';
import { User } from '@prisma/client';
import { Expose } from '@/application/providers/prisma/prisma.interface';

interface DeleteUserLogServiceExecuteProps {
  actionUserId: string;
  userDeleted: Expose<User>;
}

@Injectable()
export class DeleteUserLogService {
  constructor(private createActionLogService: CreateActionLogService) {}

  async execute({
    actionUserId,
    userDeleted,
  }: DeleteUserLogServiceExecuteProps) {
    const { actionLog } = await this.createActionLogService.execute({
      userId: actionUserId,
      action_type: 'DELETE_USER',
      action_data: {
        userDeleted: {
          id: userDeleted.id,
          name: userDeleted.name,
          email: userDeleted.email,
        },
      },
    });

    return { actionLog };
  }
}
