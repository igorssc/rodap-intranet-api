import {
  VALID_EMAIL_MESSAGE,
  VALID_PASSWORD_MESSAGE,
} from '@/application/errors/validations.constants';
import { IsEmail, IsString } from 'class-validator';

export abstract class AuthenticateDto {
  @IsEmail({}, { message: VALID_EMAIL_MESSAGE })
  email: string;

  @IsString({ message: VALID_PASSWORD_MESSAGE })
  password: string;
}
