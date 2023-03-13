import { Module } from '@nestjs/common';
import { PrismaModule } from './application/providers/prisma/prisma.module';
import { HttpModule } from './infra/http/http.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
