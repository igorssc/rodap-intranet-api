import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesAction, RolesSubject, User as UserProps } from '@prisma/client';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { FindAllActionLogsDto } from '../dtos/action-logs/find-all-action-logs.dto';
import { FindAllActionLogsService } from '@/application/useCases/actionLogs/find-all-action-logs.service';
import { FindActionLogsByUserService } from '@/application/useCases/actionLogs/user/find-action-logs-by-user.service';
import { PoliciesGuard } from '../guards/policies.guard';
import { CheckPolicies } from '../decorators/check-guard.decorator';
import { FindUniqueUserService } from '@/application/useCases/users/find-unique-user.service';
import { USER_NOT_FOUND } from '@/application/errors/errors.constants';

@Controller('actions')
export class ActionsLogController {
  constructor(
    private findAllActionLogsService: FindAllActionLogsService,
    private findActionLogsByUserService: FindActionLogsByUserService,
    private findUniqueUserService: FindUniqueUserService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findMe(@User() user: UserProps, @Query() query: FindAllActionLogsDto) {
    const { page, limit } = query;

    const userExposed = this.findActionLogsByUserService.execute({
      limit,
      page,
      userId: user.id,
    });

    return userExposed;
  }

  @Get()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async findAll(@User() user: UserProps, @Query() query: FindAllActionLogsDto) {
    const { page, limit } = query;

    return await this.findAllActionLogsService.execute({
      page,
      limit,
      hiddenId: user.id,
    });
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(RolesAction.read, RolesSubject.USER)
  async findUnique(
    @Param('userId') userId: string,
    @Query() query: FindAllActionLogsDto,
  ) {
    const { user } = await this.findUniqueUserService.execute(userId);

    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    const { page, limit } = query;

    const userExposed = this.findActionLogsByUserService.execute({
      limit,
      page,
      userId: user.id,
    });

    return userExposed;
  }
}
