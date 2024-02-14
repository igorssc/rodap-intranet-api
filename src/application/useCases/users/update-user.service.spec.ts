import { InMemoryUsersRepository } from '@/application/repositories/implementations/in-memory-users-repository';
import { UsersRepository } from '@/application/repositories/users-repository';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import { UpdateUserService } from './update-user.service';
import { beforeEach, describe, expect, it } from 'vitest';
import { PrismaService } from '@/application/providers/prisma/prisma.service';

describe('Update User Use Case', () => {
  let usersRepository: UsersRepository;
  let sut: UpdateUserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserService,
        PrismaService,
        { provide: UsersRepository, useClass: InMemoryUsersRepository },
      ],
    }).compile();

    usersRepository = moduleRef.get(UsersRepository);
    sut = moduleRef.get(UpdateUserService);
  });

  it('should be able to update a user', async () => {
    const password_hash = await hash('123456', 6);

    const userCreated = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash,
    });

    const userChanged = await sut.execute(userCreated.id, { name: 'Peter' });

    expect(userChanged.id).toEqual(userCreated.id);

    expect(userChanged.name).toEqual('Peter');

    expect(userChanged).not.toHaveProperty('password_hash');
  });
});
