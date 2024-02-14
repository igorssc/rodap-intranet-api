import { InMemoryUsersRepository } from '@/application/repositories/implementations/in-memory-users.repository';
import { UsersRepository } from '@/application/repositories/users.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { PrismaService } from '@/application/providers/prisma/prisma.service';
import { FindMeService } from './find-me.service';

describe('Find Me Use Case', () => {
  let usersRepository: UsersRepository;
  let sut: FindMeService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        FindMeService,
        PrismaService,
        { provide: UsersRepository, useClass: InMemoryUsersRepository },
      ],
    }).compile();

    usersRepository = moduleRef.get(UsersRepository);
    sut = moduleRef.get(FindMeService);
  });

  it('should not be able to return the user with the password', async () => {
    const password_hash = await hash('123456', 6);

    const userCreated = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash,
    });

    const user = await sut.execute(userCreated);

    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');

    expect(user).not.toHaveProperty('password_hash');

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('johndoe@example.com');
  });
});
