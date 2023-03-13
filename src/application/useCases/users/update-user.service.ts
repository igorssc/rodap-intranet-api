import { Expose } from '@/application/providers/prisma/prisma.interface';
import { UsersRepository } from '@/application/repositories/users-repository';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';

interface UpdateUserProps {
  name?: string;
  email?: string;
  password?: string;
}

@Injectable()
export class UpdateUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(userId: string, user: UpdateUserProps): Promise<Expose<User>> {
    const password_hash = user.password && (await hash(user.password, 6));

    return await this.usersRepository.update(userId, {
      ...user,
      ...(user.password && { password_hash }),
    });
  }
}
