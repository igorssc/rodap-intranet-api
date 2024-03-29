import { PrismaModule } from '@/application/providers/prisma/prisma.module';
import { AuthenticateModule } from '@/application/use-cases/auth/authenticate.module';
import { UsersModule } from '@/application/use-cases/users/users.module';
import { Module } from '@nestjs/common';
import { CaslAbilitylModule } from '../casl/casl-ability.module';
import { AuthenticateController } from '../controllers/authenticate.controller';
import { UsersController } from '../controllers/users.controller';
import { GuardsModule } from '../guards/guards.module';
import { ActionLogsModule } from '@/application/use-cases/action-logs/action-logs.module';
import { ActionLogsController } from '../controllers/action-logs.controller';
import { FilesModule } from '@/application/use-cases/files/files.module';
import { SupportTicketsController } from '../controllers/support-tickets.controller';
import { SupportTicketsModule } from '@/application/use-cases/support-tickets/support-tickets.module';
import { SupportTicketMessagesModule } from '@/application/use-cases/support-ticket-messages/support-ticket-messages.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    GuardsModule,
    AuthenticateModule,
    CaslAbilitylModule,
    ActionLogsModule,
    FilesModule,
    SupportTicketsModule,
    SupportTicketMessagesModule,
  ],
  controllers: [
    UsersController,
    AuthenticateController,
    ActionLogsController,
    SupportTicketsController,
  ],
  providers: [],
})
export class HttpModule {}
