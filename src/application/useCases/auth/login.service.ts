import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

type LoginUseCaseProps = User;

interface LoginUseCaseResponse {
  access_token: string;
}

@Injectable()
export class LoginService {
  constructor(private jwtService: JwtService) {}

  async execute(user: LoginUseCaseProps): Promise<LoginUseCaseResponse> {
    const payload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
