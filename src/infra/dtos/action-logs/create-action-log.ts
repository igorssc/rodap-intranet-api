import {
  ACTION_DATA_OBJECT_MESSAGE,
  ACTION_TYPE_VALID_MESSAGE,
} from '@/application/errors/validations.constants';
import { ActionLogType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsObject, IsOptional } from 'class-validator';

export abstract class CreateActionLogDto {
  @IsEnum(ActionLogType, {
    message: ACTION_TYPE_VALID_MESSAGE,
  })
  action_type: ActionLogType;

  @IsObject({ message: ACTION_DATA_OBJECT_MESSAGE })
  @IsOptional()
  @Type(() => Object)
  action_data?: object;
}
