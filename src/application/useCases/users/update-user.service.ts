import { Expose } from '@/application/providers/prisma/prisma.interface';
import { PrismaService } from '@/application/providers/prisma/prisma.service';
import { UsersRepository } from '@/application/repositories/users-repository';
import { UpdateUserDto } from '@/infra/dtos/users/update-user.dto';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';

@Injectable()
export class UpdateUserService {
  constructor(
    private usersRepository: UsersRepository,
    private prismaService: PrismaService,
  ) {}

  async execute(userId: string, user: UpdateUserDto): Promise<Expose<User>> {
    const password_hash = user.password && (await hash(user.password, 6));

    const userUpdated = await this.usersRepository.update(userId, {
      ...user,
      ...(user.password && { password_hash }),
    });

    const usersExposed = this.prismaService.expose(userUpdated);

    return usersExposed;
  }
}
