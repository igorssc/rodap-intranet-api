import { PrismaModule } from '@/application/providers/prisma/prisma.module';
import { AuthenticateModule } from '@/application/useCases/auth/authenticate.module';
import { UsersModule } from '@/application/useCases/users/users.module';
import { Module } from '@nestjs/common';
import { AuthenticateController } from '../controllers/authenticate.controller';
import { UsersController } from '../controllers/users.controller';
import { GuardsModule } from '../guards/guards.module';

@Module({
  imports: [PrismaModule, UsersModule, GuardsModule, AuthenticateModule],
  controllers: [UsersController, AuthenticateController],
  providers: [],
})
export class HttpModule {}
