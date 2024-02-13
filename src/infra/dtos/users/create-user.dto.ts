import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export abstract class CreateUserDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  @MinLength(5, { message: 'O nome deve ter no mínimo 5 caracteres.' })
  name: string;

  @IsEmail({}, { message: 'O email deve ser válido.' })
  email: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password: string;
}
