import { UsersRepository } from '@/application/repositories/users.repository';
import { capitalizeInitials } from '@/application/utils/capitalize-initials';
import { UpdateUserDto } from '@/infra/dtos/users/update-user.dto';
import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';

@Injectable()
export class UpdateUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(userId: string, user: UpdateUserDto) {
    const password_hash = user.password && (await hash(user.password, 6));

    const { password, ...userToUpdate } = user;

    const userUpdated = await this.usersRepository.update(userId, {
      ...userToUpdate,
      ...(user.name && { name: capitalizeInitials(user.name) }),
      ...(password && { password_hash }),
    });

    return { user: userUpdated };
  }
}
