import { FindAllUserService } from '@/application/useCases/users/find-all-user.service';
import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class FindAllUserController {
  constructor(private findAllUserService: FindAllUserService) {}

  @Get()
  async findAll() {
    return await this.findAllUserService.execute();
  }
}
