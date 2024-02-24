import {
  INVALID_PERMISSION,
  USER_NOT_FOUND,
} from '@/application/errors/errors.constants';
import { CreateUserService } from '@/application/use-cases/users/create-user.service';
import { DeleteUniqueUserService } from '@/application/use-cases/users/delete-unique-user.service';
import { FindAllUsersService } from '@/application/use-cases/users/find-all-users.service';
import { FindUniqueUserService } from '@/application/use-cases/users/find-unique-user.service';
import { UpdateUserService } from '@/application/use-cases/users/update-user.service';
import { CreateUserDto } from '@/infra/dtos/users/create-user.dto';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { RolesAction, RolesSubject, User as UserProps } from '@prisma/client';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CheckPolicies } from '../decorators/check-guard.decorator';
import { UpdateUserDto } from '../dtos/users/update-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PoliciesGuard } from '../guards/policies.guard';
import { FindAllUsersDto } from '../dtos/users/find-all-users.dto';
import { User } from '../decorators/user.decorator';
import { CreateUserLogService } from '@/application/use-cases/action-logs/user/create-user-logs.service';
import { UpdateUserLogService } from '@/application/use-cases/action-logs/user/update-user-logs.service';
import { PrismaService } from '@/application/providers/prisma/prisma.service';
import { DeleteUserLogService } from '@/application/use-cases/action-logs/user/delete-user-logs.service';
import { UploadPictureProfileService } from '@/application/use-cases/files/user/upload-picture-profile.service';
import { UpdateMeUserDto } from '../dtos/users/update-me-user.dto';
import { PictureUploadInterceptor } from '../decorators/picture-upload-interceptor.decorator';
import { UpdateMeLogService } from '@/application/use-cases/action-logs/user/update-me-logs.service';

@Controller('users')
export class UsersController {
  constructor(
    private createUserService: CreateUserService,
    private findAllUsersService: FindAllUsersService,
    private findUniqueUserService: FindUniqueUserService,
    private updateUserService: UpdateUserService,
    private deleteUniqueUserService: DeleteUniqueUserService,
    private caslAbilityFactory: CaslAbilityFactory,
    private createUserLogService: CreateUserLogService,
    private updateUserLogService: UpdateUserLogService,
    private deleteUserLogService: DeleteUserLogService,
    private uploadPictureProfileService: UploadPictureProfileService,
    private updateMeLogService: UpdateMeLogService,
    private prismaService: PrismaService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findMe(@User() user: UserProps) {
    const userExposed = this.prismaService.expose(user);

    return userExposed;
  }

  @Get(':query')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(RolesAction.READ, RolesSubject.USER)
  async findUnique(@Param('query') query: string) {
    const { user } = await this.findUniqueUserService.execute(query);

    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    const userExposed = this.prismaService.expose(user);

    return userExposed;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(RolesAction.READ, RolesSubject.USER)
  async findAll(@User() user: UserProps, @Query() query: FindAllUsersDto) {
    const { page, limit } = query;

    return await this.findAllUsersService.execute({
      page,
      limit,
      hiddenId: user.id,
    });
  }

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(RolesAction.CREATE, RolesSubject.USER)
  async createUser(@Body() body: CreateUserDto, @User() user: UserProps) {
    const { user: userCreated } = await this.createUserService.execute(body);

    const userExposed = this.prismaService.expose(userCreated);

    await this.createUserLogService.execute({
      actionUser: user,
      userCreated,
    });

    return userExposed;
  }

  @Patch('picture-profile')
  @UseGuards(JwtAuthGuard)
  @PictureUploadInterceptor()
  async updatePictureProfileMe(
    @UploadedFile() file: Express.Multer.File,
    @User() user: UserProps,
  ) {
    const { user: userUpdated } =
      await this.uploadPictureProfileService.execute(user, file);

    await this.updateMeLogService.execute({
      actionUserId: user.id,
      userUpdatedBefore: user,
      userUpdatedAfter: userUpdated,
    });
  }

  @Patch('picture-profile/:userId')
  @UseGuards(JwtAuthGuard)
  @CheckPolicies(RolesAction.UPDATE, RolesSubject.USER)
  @PictureUploadInterceptor()
  async updatePictureProfile(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @User() user: UserProps,
  ) {
    const { user: userToBeChanged } = await this.findUniqueUserService.execute(
      userId,
    );

    if (!userToBeChanged) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    const { user: userUpdated } =
      await this.uploadPictureProfileService.execute(userToBeChanged, file);

    await this.updateUserLogService.execute({
      actionUser: user,
      updatedUser: userToBeChanged,
      userUpdatedBefore: userToBeChanged,
      userUpdatedAfter: userUpdated,
    });
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateMe(@Body() body: UpdateMeUserDto, @User() user: UserProps) {
    const { user: userUpdated } = await this.updateUserService.execute(
      user.id,
      body,
    );

    const userExposed = this.prismaService.expose(userUpdated);

    await this.updateMeLogService.execute({
      actionUserId: user.id,
      userUpdatedBefore: user,
      userUpdatedAfter: userUpdated,
    });

    return userExposed;
  }

  @Patch(':userId')
  @UseGuards(JwtAuthGuard)
  @CheckPolicies(RolesAction.UPDATE, RolesSubject.USER)
  async update(
    @Param('userId') userId: string,
    @Body() body: UpdateUserDto,
    @User() user: UserProps,
  ) {
    const { user: userToBeChanged } = await this.findUniqueUserService.execute(
      userId,
    );

    if (!userToBeChanged) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    if (body.is_admin && !user.is_admin) {
      body.is_admin = undefined;
    }

    const { user: userUpdated } = await this.updateUserService.execute(
      userId,
      body,
    );

    const userExposed = this.prismaService.expose(userUpdated);

    await this.updateUserLogService.execute({
      actionUser: user,
      updatedUser: userToBeChanged,
      userUpdatedBefore: userToBeChanged,
      userUpdatedAfter: userUpdated,
    });

    return userExposed;
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(RolesAction.DELETE, RolesSubject.USER)
  async deleteUnique(@Param('userId') userId: string, @User() user: UserProps) {
    const { user: userToBeDeleted } = await this.findUniqueUserService.execute(
      userId,
    );

    if (!userToBeDeleted) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    if (user.id === userToBeDeleted.id) {
      throw new ForbiddenException(INVALID_PERMISSION);
    }

    await this.deleteUniqueUserService.execute(userId);

    await this.deleteUserLogService.execute({
      actionUser: user,
      userDeleted: userToBeDeleted,
    });
  }
}
