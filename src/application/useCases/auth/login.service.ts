import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface LoginUseCaseProps {
  userId: string;
}

interface LoginUseCaseResponse {
  access_token: string;
}

@Injectable()
export class LoginService {
  constructor(private jwtService: JwtService) {}

  async execute({ userId }: LoginUseCaseProps): Promise<LoginUseCaseResponse> {
    const payload = { sub: userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
