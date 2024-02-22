import {
  INVALID_CREDENTIALS,
  USER_IS_BLOCKED,
} from '@/application/errors/errors.constants';
import { FindUniqueUserService } from '@/application/use-cases/users/find-unique-user.service';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../../application/use-cases/auth/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private findUniqueUserService: FindUniqueUserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: { sub: string }) {
    const { user } = await this.findUniqueUserService.execute(payload.sub);

    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    if (!user.is_active) {
      throw new ForbiddenException(USER_IS_BLOCKED);
    }

    return user;
  }
}
