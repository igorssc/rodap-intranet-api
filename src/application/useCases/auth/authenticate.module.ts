import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from './constants';
import { LoginService } from './login.service';
import { ValidateUserService } from './validate-user.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [ValidateUserService, LoginService],
  exports: [ValidateUserService, LoginService],
})
export class AuthenticateModule {}
