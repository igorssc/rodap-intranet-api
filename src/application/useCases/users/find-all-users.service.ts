import { Expose } from '@/application/providers/prisma/prisma.interface';
import { UsersRepository } from '@/application/repositories/users-repository';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class FindAllUsersService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(): Promise<Expose<User>[]> {
    return await this.usersRepository.findAll();
  }
}
