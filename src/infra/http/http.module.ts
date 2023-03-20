import { PrismaModule } from '@/application/providers/prisma/prisma.module';
import { InMemoryUsersRepository } from '@/application/repositories/implementations/in-memory-users-repository';
import { UsersRepository } from '@/application/repositories/users-repository';
import { CreateUserService } from '@/application/useCases/users/create-user.service';
import { FindAllUsersService } from '@/application/useCases/users/find-all-users.service';
import { UpdateUserService } from '@/application/useCases/users/update-user.service';
import { Module } from '@nestjs/common';
import { UsersController } from '../controllers/users.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    CreateUserService,
    FindAllUsersService,
    UpdateUserService,
    { provide: UsersRepository, useClass: InMemoryUsersRepository },
  ],
})
export class HttpModule {}
