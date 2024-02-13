import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  AppAbilityType,
  CaslAbilityFactory,
} from '../casl/casl-ability.factory';
import { CHECK_POLICIES_KEY } from '../decorators/check-guard.decorator';
import { INVALID_PERMISSION } from '@/application/errors/errors.constants';

interface IPolicyHandler {
  handle(ability: AppAbilityType): boolean;
}

type PolicyHandlerCallback = (ability: AppAbilityType) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest();

    const ability = this.caslAbilityFactory.createForUser(user);

    const isAllowed = policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );

    if (!isAllowed) {
      throw new ForbiddenException(INVALID_PERMISSION);
    }

    return isAllowed;
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbilityType) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
