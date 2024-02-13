import { IsEmail, IsString } from 'class-validator';

export abstract class AuthenticateDto {
  @IsEmail({}, { message: 'O email deve ser válido.' })
  email: string;

  @IsString({ message: 'A senha deve ser válida.' })
  password: string;
}
