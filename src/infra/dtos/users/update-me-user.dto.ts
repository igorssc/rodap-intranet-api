import {
  MIN_NAME_LENGTH_MESSAGE,
  MIN_PASSWORD_LENGTH_MESSAGE,
  NAME_STRING_MESSAGE,
  PASSWORD_STRING_MESSAGE,
  VALID_EMAIL_MESSAGE,
} from '@/application/errors/validations.constants';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export abstract class UpdateMeUserDto {
  @IsString({ message: NAME_STRING_MESSAGE })
  @IsOptional()
  @MinLength(5, { message: MIN_NAME_LENGTH_MESSAGE })
  name?: string;

  @IsEmail({}, { message: VALID_EMAIL_MESSAGE })
  @IsOptional()
  email?: string;

  @IsString({ message: PASSWORD_STRING_MESSAGE })
  @IsOptional()
  @MinLength(6, { message: MIN_PASSWORD_LENGTH_MESSAGE })
  password?: string;
}
