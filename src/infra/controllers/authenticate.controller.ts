import { LoginService } from '@/application/useCases/auth/login.service';
import { LocalAuthGuard } from '@/infra/guards/local-auth.guard';
import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';

interface LoginResponse {
  access_token: string;
}

@Controller('auth')
export class AuthenticateController {
  constructor(private loginService: LoginService) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any): Promise<LoginResponse> {
    return this.loginService.execute(req.user);
  }
}
