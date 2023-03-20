import { CreateUserService } from '@/application/useCases/users/create-user.service';
import { FindAllUsersService } from '@/application/useCases/users/find-all-users.service';
import { UpdateUserService } from '@/application/useCases/users/update-user.service';
import { CreateUserDto } from '@/infra/dtos/users/create-user.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from '../dtos/users/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private createUserService: CreateUserService,
    private findAllUserService: FindAllUsersService,
    private updateUserService: UpdateUserService,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createUser(@Body() body: CreateUserDto): Promise<void> {
    await this.createUserService.execute(body);
  }

  @Get()
  async findAll() {
    return await this.findAllUserService.execute();
  }

  @Put(':userId')
  async update(@Param('userId') userId: string, @Body() body: UpdateUserDto) {
    return await this.updateUserService.execute(userId, body);
  }
}
