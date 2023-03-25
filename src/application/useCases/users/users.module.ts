import { InMemoryUsersRepository } from '@/application/repositories/implementations/in-memory-users-repository';
import { UsersRepository } from '@/application/repositories/users-repository';
import { Module } from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { FindAllUsersService } from './find-all-users.service';
import { UpdateUserService } from './update-user.service';

@Module({
  imports: [],
  providers: [
    CreateUserService,
    FindAllUsersService,
    UpdateUserService,
    { provide: UsersRepository, useClass: InMemoryUsersRepository },
  ],
  exports: [
    CreateUserService,
    FindAllUsersService,
    UpdateUserService,
    UsersRepository,
  ],
})
export class UsersModule {}
