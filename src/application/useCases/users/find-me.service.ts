import { Expose } from '@/application/providers/prisma/prisma.interface';
import { PrismaService } from '@/application/providers/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class FindMeService {
  constructor(private prismaService: PrismaService) {}

  async execute(user: User): Promise<Expose<User>> {
    return this.prismaService.expose(user);
  }
}
