import { INVALID_PARAMS } from '@/application/errors/errors.constants';
import { UserWithRoles } from '@/application/interfaces/user';
import { Expose } from '@/application/providers/prisma/prisma.interface';
import { PrismaService } from '@/application/providers/prisma/prisma.service';
import { UsersRepository } from '@/application/repositories/users-repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { isEmail, isUUID } from 'class-validator';

@Injectable()
export class FindUniqueUserService {
  constructor(
    private usersRepository: UsersRepository,
    private prismaService: PrismaService,
  ) {}

  async execute(query: string): Promise<Expose<UserWithRoles>> {
    if (isUUID(query)) {
      const user = await this.usersRepository.findById(query);

      const userExposed = this.prismaService.expose(user);

      return userExposed;
    }
    if (isEmail(query)) {
      const user = await this.usersRepository.findByEmail(query);

      const userExposed = this.prismaService.expose(user);

      return userExposed;
    }

    throw new BadRequestException(INVALID_PARAMS);
  }
}
