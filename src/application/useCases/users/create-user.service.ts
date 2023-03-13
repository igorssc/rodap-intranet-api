import { Expose } from '@/application/providers/prisma/prisma.interface';
import { UsersRepository } from '@/application/repositories/users-repository';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';

interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class CreateUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserProps): Promise<Expose<User>> {
    const password_hash = await hash(password, 6);

    return await this.usersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}
