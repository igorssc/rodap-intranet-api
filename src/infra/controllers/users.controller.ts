import {
  INVALID_PERMISSION,
  USER_NOT_FOUND,
} from '@/application/errors/errors.constants';
import { UserWithRoles } from '@/application/interfaces/user';
import { CreateUserService } from '@/application/useCases/users/create-user.service';
import { DeleteUniqueUserService } from '@/application/useCases/users/delete-unique-user.service';
import { FindAllUsersService } from '@/application/useCases/users/find-all-users.service';
import { FindUniqueUserService } from '@/application/useCases/users/find-unique-user.service';
import { UpdateUserService } from '@/application/useCases/users/update-user.service';
import { CreateUserDto } from '@/infra/dtos/users/create-user.dto';
import { subject } from '@casl/ability';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RolesAction, RolesSubject } from '@prisma/client';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CheckPolicies } from '../decorators/check-guard.decorator';
import { UpdateUserDto } from '../dtos/users/update-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PoliciesGuard } from '../guards/policies.guard';
import { FindAllUsersDto } from '../dtos/users/find-all-users.dto';

@Controller('users')
export class UsersController {
  constructor(
    private createUserService: CreateUserService,
    private findAllUsersService: FindAllUsersService,
    private findUniqueUserService: FindUniqueUserService,
    private updateUserService: UpdateUserService,
    private deleteUniqueUserService: DeleteUniqueUserService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(RolesAction.create, RolesSubject.USER)
  async createUser(@Body() body: CreateUserDto) {
    const { user } = await this.createUserService.execute(body);

    return user;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findMe(@Req() req: any) {
    const { user } = req;

    return user;
  }

  @Get(':query')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(RolesAction.read, RolesSubject.USER)
  async findUnique(@Param('query') query: string) {
    const user = await this.findUniqueUserService.execute(query);

    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    return user;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(RolesAction.read, RolesSubject.USER)
  async findAll(@Req() req: any, @Query() query: FindAllUsersDto) {
    const { page, limit } = query;

    const { user } = req;

    return await this.findAllUsersService.execute({
      page,
      limit,
      hiddenId: user.id,
    });
  }

  @Put(':userId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('userId') userId: string,
    @Body() body: UpdateUserDto,
    @Req() req: any,
  ) {
    const { user } = req;
    const { is_admin } = body;

    const ability = this.caslAbilityFactory.createForUser(
      subject(RolesSubject.USER, user as UserWithRoles),
    );

    const userToBeChanged = await this.findUniqueUserService.execute(userId);

    if (!userToBeChanged) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    const isAllowed = ability.can(
      RolesAction.update,
      subject(RolesSubject.USER, userToBeChanged as UserWithRoles),
    );

    if (!isAllowed && user.id !== userToBeChanged.id) {
      throw new ForbiddenException(INVALID_PERMISSION);
    }

    if (is_admin && !user.is_admin) {
      body.is_admin = undefined;
    }

    return await this.updateUserService.execute(userId, body);
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(RolesAction.delete, RolesSubject.USER)
  async deleteUnique(@Param('userId') userId: string, @Req() req: any) {
    const { user } = req;

    const ability = this.caslAbilityFactory.createForUser(
      subject(RolesSubject.USER, user as UserWithRoles),
    );

    const userToBeDeleted = await this.findUniqueUserService.execute(userId);

    if (!userToBeDeleted) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    const isAllowed = ability.can(
      RolesAction.delete,
      subject(RolesSubject.USER, userToBeDeleted as UserWithRoles),
    );

    if (!isAllowed || user.id === userToBeDeleted.id) {
      throw new ForbiddenException(INVALID_PERMISSION);
    }

    await this.deleteUniqueUserService.execute(userId);
  }
}
