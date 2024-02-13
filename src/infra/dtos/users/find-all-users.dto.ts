import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export abstract class FindAllUsersDto {
  @IsOptional()
  @IsInt({ message: 'A página deve ser um número inteiro.' })
  @Min(1, { message: 'A página deve ser maior ou igual a 1.' })
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt({ message: 'O limite deve ser um número inteiro.' })
  @Min(1, { message: 'O limite deve ser maior ou igual a 1.' })
  @Type(() => Number)
  limit?: number;
}
