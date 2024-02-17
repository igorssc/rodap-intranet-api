import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import {
  LIMIT_INT_MESSAGE,
  MIN_LIMIT_VALUE_MESSAGE,
  MIN_PAGE_VALUE_MESSAGE,
  PAGE_INT_MESSAGE,
} from '@/application/errors/validations.constants';

export abstract class FindAllActionLogsDto {
  @IsOptional()
  @IsInt({ message: PAGE_INT_MESSAGE })
  @Min(1, { message: MIN_PAGE_VALUE_MESSAGE })
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt({ message: LIMIT_INT_MESSAGE })
  @Min(1, { message: MIN_LIMIT_VALUE_MESSAGE })
  @Type(() => Number)
  limit?: number;
}
