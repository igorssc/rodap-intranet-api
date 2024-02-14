import { PrismaService } from '@/application/providers/prisma/prisma.service';
import { PrismaUsersRepository } from '@/application/repositories/implementations/prisma-users.repository';
import { UsersRepository } from '@/application/repositories/users.repository';
import { Module } from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { DeleteUniqueUserService } from './delete-unique-user.service';
import { FindAllUsersService } from './find-all-users.service';
import { FindUniqueUserService } from './find-unique-user.service';
import { UpdateUserService } from './update-user.service';
import { FindMeService } from './find-me.service';

@Module({
  imports: [],
  providers: [
    CreateUserService,
    FindAllUsersService,
    UpdateUserService,
    PrismaService,
    FindUniqueUserService,
    DeleteUniqueUserService,
    FindMeService,
    { provide: UsersRepository, useClass: PrismaUsersRepository },
  ],
  exports: [
    CreateUserService,
    FindAllUsersService,
    UpdateUserService,
    UsersRepository,
    FindUniqueUserService,
    DeleteUniqueUserService,
    FindMeService,
  ],
})
export class UsersModule {}
