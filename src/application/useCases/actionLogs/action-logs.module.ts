import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { CreateActionLogService } from './create-action-logs.service';
import { ActionLogsRepository } from '@/application/repositories/action-logs.repository';
import { PrismaActionLogsRepository } from '@/application/repositories/implementations/prisma-action-logs.repository';
import { PrismaService } from '@/application/providers/prisma/prisma.service';
import { UpdateUserLogService } from './user/update-user-logs.service';
import { CreateUserLogService } from './user/create-user-logs.service';
import { FindAllActionLogsService } from './find-all-action-logs.service';
import { FindActionLogsByUserService } from './user/find-action-logs-by-user.service';
import { DeleteUserLogService } from './user/delete-user-logs.service';
import { UpdateMeLogService } from './user/update-me-logs.service';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [
    CreateActionLogService,
    CreateUserLogService,
    UpdateUserLogService,
    FindAllActionLogsService,
    FindActionLogsByUserService,
    DeleteUserLogService,
    PrismaService,
    UpdateMeLogService,
    { provide: ActionLogsRepository, useClass: PrismaActionLogsRepository },
  ],
  exports: [
    CreateActionLogService,
    CreateUserLogService,
    UpdateUserLogService,
    ActionLogsRepository,
    FindAllActionLogsService,
    FindActionLogsByUserService,
    DeleteUserLogService,
    UpdateMeLogService,
  ],
})
export class ActionLogsModule {}
