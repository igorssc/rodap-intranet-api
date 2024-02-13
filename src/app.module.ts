import { Module } from '@nestjs/common';
import { PrismaModule } from './application/providers/prisma/prisma.module';
import { HttpModule } from './infra/http/http.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './application/exceptions/http-exception.filter';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
