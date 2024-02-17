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
import { CreateUserLogService } from '@/application/useCases/actionLogs/user/create-user-logs.service';
import { UpdateUserLogService } from '@/application/useCases/actionLogs/user/update-user-logs.service';
import { PrismaService } from '@/application/providers/prisma/prisma.service';
import { DeleteUserLogService } from '@/application/useCases/actionLogs/user/delete-user-logs.service';
import { UploadPictureProfileService } from '@/application/useCases/files/user/upload-picture-profile.service';
import { UpdateMeUserDto } from '../dtos/users/update-me-user.dto';
import { PictureUploadInterceptor } from '../decorators/picture-upload-interceptor.decorator';
import { UpdateMeLogService } from '@/application/useCases/actionLogs/user/update-me-logs.service';

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
  @CheckPolicies(RolesAction.read, RolesSubject.USER)
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
  @CheckPolicies(RolesAction.read, RolesSubject.USER)
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
  @CheckPolicies(RolesAction.create, RolesSubject.USER)
  async createUser(@Body() body: CreateUserDto, @User() user: UserProps) {
    const { user: userCreated } = await this.createUserService.execute(body);

    const userExposed = this.prismaService.expose(userCreated);

    await this.createUserLogService.execute({
      actionUserId: user.id,
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
  @CheckPolicies(RolesAction.update, RolesSubject.USER)
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
      actionUserId: user.id,
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
  async update(
    @Param('userId') userId: string,
    @Body() body: UpdateUserDto,
    @User() user: UserProps,
  ) {
    const ability = this.caslAbilityFactory.createForUser(
      subject(RolesSubject.USER, user as UserWithRoles),
    );

    const { user: userToBeChanged } = await this.findUniqueUserService.execute(
      userId,
    );

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

    if (body.is_admin && !user.is_admin) {
      body.is_admin = undefined;
    }

    const { user: userUpdated } = await this.updateUserService.execute(
      userId,
      body,
    );

    const userExposed = this.prismaService.expose(userUpdated);

    await this.updateUserLogService.execute({
      actionUserId: user.id,
      updatedUser: userToBeChanged,
      userUpdatedBefore: userToBeChanged,
      userUpdatedAfter: userUpdated,
    });

    return userExposed;
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(RolesAction.delete, RolesSubject.USER)
  async deleteUnique(@Param('userId') userId: string, @User() user: UserProps) {
    const ability = this.caslAbilityFactory.createForUser(
      subject(RolesSubject.USER, user as UserWithRoles),
    );

    const { user: userToBeDeleted } = await this.findUniqueUserService.execute(
      userId,
    );

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

    await this.deleteUserLogService.execute({
      actionUserId: user.id,
      userDeleted: userToBeDeleted,
    });
  }
}
