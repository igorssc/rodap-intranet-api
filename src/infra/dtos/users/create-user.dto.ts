import {
  MIN_NAME_LENGTH_MESSAGE,
  MIN_PASSWORD_LENGTH_MESSAGE,
  NAME_NOT_EMPTY_MESSAGE,
  NAME_STRING_MESSAGE,
  PASSWORD_NOT_EMPTY_MESSAGE,
  PASSWORD_STRING_MESSAGE,
  VALID_EMAIL_MESSAGE,
} from '@/application/errors/validations.constants';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export abstract class CreateUserDto {
  @IsString({ message: NAME_STRING_MESSAGE })
  @IsNotEmpty({ message: NAME_NOT_EMPTY_MESSAGE })
  @MinLength(5, { message: MIN_NAME_LENGTH_MESSAGE })
  name: string;

  @IsEmail({}, { message: VALID_EMAIL_MESSAGE })
  email: string;

  @IsString({ message: PASSWORD_STRING_MESSAGE })
  @IsNotEmpty({ message: PASSWORD_NOT_EMPTY_MESSAGE })
  @MinLength(6, { message: MIN_PASSWORD_LENGTH_MESSAGE })
  password: string;
}
