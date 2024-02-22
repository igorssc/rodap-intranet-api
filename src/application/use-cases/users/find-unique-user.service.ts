import { INVALID_PARAMS } from '@/application/errors/errors.constants';
import { UserWithRoles } from '@/application/interfaces/user';
import { Expose } from '@/application/providers/prisma/prisma.interface';
import { UsersRepository } from '@/application/repositories/users.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { isEmail, isUUID } from 'class-validator';

interface FindUniqueUserUseCaseResponse {
  user: Expose<UserWithRoles>;
}

@Injectable()
export class FindUniqueUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(query: string): Promise<FindUniqueUserUseCaseResponse> {
    if (isUUID(query)) {
      const user = await this.usersRepository.findById(query);

      return { user };
    }
    if (isEmail(query)) {
      const user = await this.usersRepository.findByEmail(query);

      return { user };
    }

    throw new BadRequestException(INVALID_PARAMS);
  }
}
