import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { Expose } from './prisma.interface';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  expose<T>(item: T): Expose<T> {
    if (!item) return {} as T;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...visibleData } = item as Partial<User>;

    return visibleData as Expose<T>;
  }
}
