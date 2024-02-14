import { ActionLog, Prisma } from '@prisma/client';

export interface FindAllByUserProps {
  userId: string;
  page: number;
  pageSize: number;
}

export interface FindAllProps {
  page: number;
  pageSize: number;
}

export abstract class ActionLogsRepository {
  create: (actionLog: Prisma.ActionLogCreateInput) => Promise<ActionLog>;

  findAll: (props: FindAllProps) => Promise<ActionLog[]>;

  findAllByUser: (props: FindAllByUserProps) => Promise<ActionLog[]>;

  totalCount: () => Promise<number>;

  totalUserCount: (userId: string) => Promise<number>;
}
