import { Expose } from '@/application/providers/prisma/prisma.interface';
import { UsersRepository } from '@/application/repositories/users-repository';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class DeleteUniqueUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(userId: string): Promise<Expose<User>> {
    return await this.usersRepository.deleteUnique(userId);
  }
}
