import { Expose } from '@/application/providers/prisma/prisma.interface';
import { CreateUserService } from '@/application/useCases/users/create-user.service';
import { CreateUserDto } from '@/infra/dtos/users/create-user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';

@Controller('users')
export class CreateUserController {
  constructor(private createUserService: CreateUserService) {}

  @Post()
  async create(@Body() body: CreateUserDto): Promise<Expose<User>> {
    return await this.createUserService.execute(body);
  }
}
