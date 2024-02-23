import {
  DESCRIPTION_STRING_MESSAGE,
  MIN_DESCRIPTION_LENGTH_MESSAGE,
  MIN_TITLE_LENGTH_MESSAGE,
  TITLE_STRING_MESSAGE,
} from '@/application/errors/validations.constants';
import { IsString, MinLength } from 'class-validator';

export abstract class CreateSupportTicketDto {
  @IsString({ message: TITLE_STRING_MESSAGE })
  @MinLength(10, { message: MIN_TITLE_LENGTH_MESSAGE })
  title: string;

  @IsString({ message: DESCRIPTION_STRING_MESSAGE })
  @MinLength(20, { message: MIN_DESCRIPTION_LENGTH_MESSAGE })
  description: string;
}
