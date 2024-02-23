import { DESCRIPTION_STRING_MESSAGE } from '@/application/errors/validations.constants';
import { IsString } from 'class-validator';

export abstract class CreateSupportTicketMessageDto {
  @IsString({ message: DESCRIPTION_STRING_MESSAGE })
  message: string;
}
