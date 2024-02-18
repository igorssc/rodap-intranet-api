import { describe, expect, it } from 'vitest';
import { pagination } from './pagination';

describe('pagination function', () => {
  it('should correctly paginate the data', () => {
    const data = [1, 2, 3, 4, 5];
    const page = 1;
    const pageSize = 2;
    const totalCount = 5;
    const result = pagination({ data, page, pageSize, totalCount });

    expect(result).toEqual({
      totalDocs: 5,
      limit: 2,
      totalPages: 3,
      page: 1,
      hasPrevPage: false,
      hasNextPage: true,
      prevPage: null,
      nextPage: 2,
      data: [1, 2, 3, 4, 5],
    });
  });
});
