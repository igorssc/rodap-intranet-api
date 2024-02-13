import { LoginService } from '@/application/useCases/auth/login.service';
import { LocalAuthGuard } from '@/infra/guards/local-auth.guard';
import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { User } from '../decorators/user.decorator';
import { User as UserProps } from '@prisma/client';

interface LoginResponse {
  access_token: string;
}

@Controller('auth')
export class AuthenticateController {
  constructor(private loginService: LoginService) {}

  @HttpCode(200)
  @Post()
  @UseGuards(LocalAuthGuard)
  async login(@User() user: UserProps): Promise<LoginResponse> {
    console.log(user);
    return this.loginService.execute(user);
  }
}
