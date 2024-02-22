import { AuthenticateModule } from '@/application/use-cases/auth/authenticate.module';
import { UsersModule } from '@/application/use-cases/users/users.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CaslAbilitylModule } from '../casl/casl-ability.module';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { LocalAuthGuard } from './local-auth.guard';
import { LocalStrategy } from './local.strategy';
import { PoliciesGuard } from './policies.guard';

@Module({
  imports: [
    AuthenticateModule,
    PassportModule,
    CaslAbilitylModule,
    UsersModule,
  ],
  providers: [
    LocalStrategy,
    JwtStrategy,
    JwtAuthGuard,
    LocalAuthGuard,
    PoliciesGuard,
  ],
})
export class GuardsModule {}
