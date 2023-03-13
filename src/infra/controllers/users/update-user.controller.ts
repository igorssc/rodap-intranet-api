import { UpdateUserService } from '@/application/useCases/users/update-user.service';
import { UpdateUserDto } from '@/infra/dtos/users/update-user.dto';
import { Body, Controller, Param, Put } from '@nestjs/common';

@Controller('users')
export class UpdateUserController {
  constructor(private updateUserService: UpdateUserService) {}

  @Put(':userId')
  async update(@Param('userId') userId: string, @Body() body: UpdateUserDto) {
    return await this.updateUserService.execute(userId, body);
  }
}
