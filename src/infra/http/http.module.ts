import { PrismaModule } from '@/application/providers/prisma/prisma.module';
import { PrismaUsersRepository } from '@/application/repositories/implementations/prisma-users-repository';
import { UsersRepository } from '@/application/repositories/users-repository';
import { CreateUserService } from '@/application/useCases/users/create-user.service';
import { FindAllUserService } from '@/application/useCases/users/find-all-user.service';
import { UpdateUserService } from '@/application/useCases/users/update-user.service';
import { Module } from '@nestjs/common';
import { CreateUserController } from '../controllers/users/create-user.controller';
import { FindAllUserController } from '../controllers/users/find-all-user.controller';
import { UpdateUserController } from '../controllers/users/update-user.controller';

@Module({
  imports: [PrismaModule],
  controllers: [
    CreateUserController,
    FindAllUserController,
    UpdateUserController,
  ],
  providers: [
    CreateUserService,
    FindAllUserService,
    UpdateUserService,
    { provide: UsersRepository, useClass: PrismaUsersRepository },
  ],
})
export class HttpModule {}
