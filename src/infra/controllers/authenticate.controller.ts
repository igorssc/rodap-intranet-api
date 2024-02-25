import { LoginService } from '@/application/use-cases/auth/login.service';
import { LocalAuthGuard } from '@/infra/guards/local-auth.guard';
import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { User } from '../decorators/user.decorator';
import { User as UserProps } from '@prisma/client';
import { CreateActionLogService } from '@/application/use-cases/action-logs/create-action-logs.service';

interface LoginResponse {
  access_token: string;
}

@Controller('auth')
export class AuthenticateController {
  constructor(
    private loginService: LoginService,
    private createActionLogService: CreateActionLogService,
  ) {}

  @HttpCode(200)
  @Post()
  @UseGuards(LocalAuthGuard)
  async login(@User() user: UserProps): Promise<LoginResponse> {
    const { access_token } = await this.loginService.execute(user);

    await this.createActionLogService.execute({
      user_id: user.id,
      action_type: 'LOGIN',
    });

    return { access_token };
  }
}
