import {
  DESCRIPTION_STRING_MESSAGE,
  MIN_DESCRIPTION_LENGTH_MESSAGE,
  MIN_TITLE_LENGTH_MESSAGE,
  STATUS_TYPE_VALID_MESSAGE,
  TITLE_STRING_MESSAGE,
} from '@/application/errors/validations.constants';
import { SupportTicketStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export abstract class UpdateSupportTicketDto {
  @IsString({ message: TITLE_STRING_MESSAGE })
  @MinLength(10, { message: MIN_TITLE_LENGTH_MESSAGE })
  @IsOptional()
  title?: string;

  @IsString({ message: DESCRIPTION_STRING_MESSAGE })
  @MinLength(20, { message: MIN_DESCRIPTION_LENGTH_MESSAGE })
  @IsOptional()
  description?: string;

  @IsEnum(SupportTicketStatus, {
    message: STATUS_TYPE_VALID_MESSAGE,
  })
  @IsOptional()
  status?: SupportTicketStatus;
}
