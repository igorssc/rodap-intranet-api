import { INVALID_PARAMS } from '@/application/errors/errors.constants';
import { UserWithRoles } from '@/application/interfaces/user';
import { UsersRepository } from '@/application/repositories/users-repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { isEmail, isUUID } from 'class-validator';

@Injectable()
export class FindUniqueUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(query: string): Promise<UserWithRoles> {
    if (isUUID(query)) {
      return await this.usersRepository.findById(query);
    }
    if (isEmail(query)) {
      return await this.usersRepository.findByEmail(query);
    }

    throw new BadRequestException(INVALID_PARAMS);
  }
}
