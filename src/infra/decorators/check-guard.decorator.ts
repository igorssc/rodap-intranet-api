import { SetMetadata } from '@nestjs/common';
import { RolesAction, RolesSubject } from '@prisma/client';
import { AppAbilityType } from '../casl/casl-ability.factory';

export const CHECK_POLICIES_KEY = 'check_policy';

export const CheckPolicies = (action: RolesAction, subject: RolesSubject) =>
  SetMetadata(CHECK_POLICIES_KEY, [
    (ability: AppAbilityType) => ability.can(action, subject),
  ]);
