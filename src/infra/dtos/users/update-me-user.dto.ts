import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export abstract class UpdateMeUserDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsOptional()
  @MinLength(5, { message: 'O nome deve ter no mínimo 5 caracteres.' })
  name?: string;

  @IsEmail({}, { message: 'O email deve ser válido.' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @IsOptional()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password?: string;
}
