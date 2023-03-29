import {
  INVALID_CREDENTIALS,
  USER_IS_BLOCKED,
} from '@/application/errors/errors.constants';
import { ValidateUserService } from '@/application/useCases/auth/validate-user.service';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private validateUserService: ValidateUserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const { user } = await this.validateUserService.execute({
      email,
      password,
    });

    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    if (!user.is_active) {
      throw new ForbiddenException(USER_IS_BLOCKED);
    }
    return user;
  }
}
