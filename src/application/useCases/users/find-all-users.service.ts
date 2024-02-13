import { PaginatedData } from '@/application/interfaces/pagination';
import { Expose } from '@/application/providers/prisma/prisma.interface';
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
  constructor(private usersRepository: UsersRepository) {}

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

    const totalCount =
      (await this.usersRepository.totalCount()) - (hiddenId ? 1 : 0);

    const dataPaginated = pagination({
      data,
      page,
      pageSize: limit,
      totalCount,
    });

    return dataPaginated;
  }
}
