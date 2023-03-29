import { USER_NOT_FOUND } from '@/application/errors/errors.constants';
import { UserWithRoles } from '@/application/interfaces/user';
import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RolesAction, RolesSubject } from '@prisma/client';

type SubjectsType =
  | Subjects<{
      USER: UserWithRoles;
    }>
  | 'all';

export type AppAbilityType = PureAbility<
  [RolesAction, SubjectsType],
  PrismaQuery
>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserWithRoles) {
    const { can, cannot, build } = new AbilityBuilder<AppAbilityType>(
      createPrismaAbility,
    );

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND);
    }

    if (user.is_admin) {
      can(RolesAction.manage, 'all');
    } else {
      user.roles.every((role) => can(role.action, role.subject));

      can(RolesAction.update, RolesSubject.USER, { id: user.id });

      cannot(RolesAction.delete, RolesSubject.USER, { id: user.id });
      cannot(RolesAction.delete, RolesSubject.USER, { is_admin: true });
      cannot(RolesAction.update, RolesSubject.USER, { is_admin: true });
    }

    return build();
  }
}
