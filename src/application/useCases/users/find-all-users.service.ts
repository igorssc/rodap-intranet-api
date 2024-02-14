import { PaginatedData } from '@/application/interfaces/pagination';
import { Expose } from '@/application/providers/prisma/prisma.interface';
import { PrismaService } from '@/application/providers/prisma/prisma.service';
import { UsersRepository } from '@/application/repositories/users-repository';
import { pagination } from '@/application/utils/pagination';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

interface FindAllUsersServiceExecuteProps {
  hiddenId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class FindAllUsersService {
  constructor(
    private usersRepository: UsersRepository,
    private prismaService: PrismaService,
  ) {}

  async execute({
    page = 1,
    limit = 10,
    hiddenId,
  }: FindAllUsersServiceExecuteProps = {}): Promise<
    PaginatedData<Expose<User>>
  > {
    const data = await this.usersRepository.findAll({
      page,
      pageSize: limit,
      hiddenId,
    });

    const dataExposed = data.map((item) => this.prismaService.expose(item));

    const totalCount =
      (await this.usersRepository.totalCount()) - (hiddenId ? 1 : 0);

    const dataPaginated = pagination({
      data: dataExposed,
      page,
      pageSize: limit,
      totalCount,
    });

    return dataPaginated;
  }
}
