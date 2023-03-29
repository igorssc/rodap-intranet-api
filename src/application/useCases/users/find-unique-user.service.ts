import { UserWithRoles } from '@/application/interfaces/user';
import { UsersRepository } from '@/application/repositories/users-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindUniqueUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(id: string): Promise<UserWithRoles> {
    return await this.usersRepository.findById(id);
  }
}
