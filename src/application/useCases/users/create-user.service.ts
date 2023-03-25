import { USER_ALREADY_EXISTS } from '@/application/errors/errors.constants';
import { UsersRepository } from '@/application/repositories/users-repository';
import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';

interface CreateUserUseCaseProps {
  name: string;
  email: string;
  password: string;
}

interface CreateUserUseCaseResponse {
  user: User;
}

@Injectable()
export class CreateUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserUseCaseProps): Promise<CreateUserUseCaseResponse> {
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
