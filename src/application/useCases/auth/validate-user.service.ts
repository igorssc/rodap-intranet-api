import { INVALID_CREDENTIALS } from '@/application/errors/errors.constants';
import { UsersRepository } from '@/application/repositories/users-repository';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { compare } from 'bcryptjs';

interface ValidateUserUseCaseProps {
  email: string;
  password: string;
}

interface ValidateUserUseCaseResponse {
  user: User;
}

@Injectable()
export class ValidateUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: ValidateUserUseCaseProps): Promise<ValidateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestException(INVALID_CREDENTIALS);
    }

    if (!user.is_active) {
      throw new UnauthorizedException();
    }

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) {
      throw new BadRequestException(INVALID_CREDENTIALS);
    }

    return { user };
  }
}
