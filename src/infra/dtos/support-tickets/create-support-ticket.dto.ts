import {
  DESCRIPTION_STRING_MESSAGE,
  MIN_DESCRIPTION_LENGTH_MESSAGE,
  MIN_TITLE_LENGTH_MESSAGE,
  SUPPORT_TICKET_PRIORITY_TYPE_VALID_MESSAGE,
  TITLE_STRING_MESSAGE,
} from '@/application/errors/validations.constants';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { SupportTicketPriority } from '@prisma/client';

export abstract class CreateSupportTicketDto {
  @IsString({ message: TITLE_STRING_MESSAGE })
  @MinLength(10, { message: MIN_TITLE_LENGTH_MESSAGE })
  title: string;

  @IsString({ message: DESCRIPTION_STRING_MESSAGE })
  @MinLength(20, { message: MIN_DESCRIPTION_LENGTH_MESSAGE })
  description: string;

  @IsEnum(SupportTicketPriority, {
    message: SUPPORT_TICKET_PRIORITY_TYPE_VALID_MESSAGE,
  })
  @Transform(({ value }) => value.toUpperCase())
  @IsOptional()
  priority?: SupportTicketPriority;
}
