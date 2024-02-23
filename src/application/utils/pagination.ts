import { PaginatedData } from '../interfaces/pagination';

type PaginationProps<T> = {
  data: T[];
  totalCount?: number;
  page: number;
  pageSize: number;
};

export const pagination = <T>({
  data,
  page,
  pageSize,
  totalCount,
}: PaginationProps<T>): PaginatedData<T> => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    totalDocs: totalCount,
    limit: pageSize,
    totalPages,
    page,
    hasPrevPage,
    hasNextPage,
    prevPage: hasPrevPage ? page - 1 : null,
    nextPage: hasNextPage ? page + 1 : null,
    data,
  };
};
