import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from './constants';
import { LoginService } from './login.service';
import { ValidateUserService } from './validate-user.service';
import { ActionLogsModule } from '../actionLogs/action-logs.module';

@Module({
  imports: [
    UsersModule,
    ActionLogsModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [ValidateUserService, LoginService],
  exports: [ValidateUserService, LoginService],
})
export class AuthenticateModule {}
