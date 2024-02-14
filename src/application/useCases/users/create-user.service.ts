import { USER_ALREADY_EXISTS } from '@/application/errors/errors.constants';
import { Expose } from '@/application/providers/prisma/prisma.interface';
import { UsersRepository } from '@/application/repositories/users.repository';
import { CreateUserDto } from '@/infra/dtos/users/create-user.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';

interface CreateUserUseCaseResponse {
  user: Expose<User>;
}

@Injectable()
export class CreateUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(data: CreateUserDto): Promise<CreateUserUseCaseResponse> {
    const { name, email, password } = data;

    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new ConflictException(USER_ALREADY_EXISTS);
    }

    const userCreated = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return { user: userCreated };
  }
}
