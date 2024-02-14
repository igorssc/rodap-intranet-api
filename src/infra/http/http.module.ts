import { PrismaModule } from '@/application/providers/prisma/prisma.module';
import { AuthenticateModule } from '@/application/useCases/auth/authenticate.module';
import { UsersModule } from '@/application/useCases/users/users.module';
import { Module } from '@nestjs/common';
import { CaslAbilitylModule } from '../casl/casl-ability.module';
import { AuthenticateController } from '../controllers/authenticate.controller';
import { UsersController } from '../controllers/users.controller';
import { GuardsModule } from '../guards/guards.module';
import { ActionLogsModule } from '@/application/useCases/actionLogs/action-logs.module';
import { ActionsLogController } from '../controllers/actions-type.controller';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    GuardsModule,
    AuthenticateModule,
    CaslAbilitylModule,
    ActionLogsModule,
  ],
  controllers: [UsersController, AuthenticateController, ActionsLogController],
  providers: [],
})
export class HttpModule {}
