import { Prisma, User } from '@prisma/client';

const userWithRoles = Prisma.validator<Prisma.UserArgs>()({
  include: { roles: true },
});

export type UserWithRoles = Prisma.UserGetPayload<typeof userWithRoles>;

export type PartialUserWithMasterData = Partial<User> &
  Pick<User, 'id' | 'name' | 'email'>;
