import { ActionLogType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsObject, IsOptional } from 'class-validator';

export abstract class CreateActionLogDto {
  @IsEnum(ActionLogType, {
    message: 'O tipo de ação deve ser um valor válido.',
  })
  action_type: ActionLogType;

  @IsObject({ message: 'Os dados da ação devem ser um valor válida.' })
  @IsOptional()
  @Type(() => Object)
  action_data?: object;
}
