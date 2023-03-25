import { AuthenticateModule } from '@/application/useCases/auth/authenticate.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { LocalAuthGuard } from './local-auth.guard';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [AuthenticateModule, PassportModule],
  providers: [LocalStrategy, JwtStrategy, JwtAuthGuard, LocalAuthGuard],
})
export class GuardsModule {}
