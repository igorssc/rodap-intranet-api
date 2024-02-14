import { InMemoryUsersRepository } from '@/application/repositories/implementations/in-memory-users.repository';
import { UsersRepository } from '@/application/repositories/users.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import { FindUniqueUserService } from './find-unique-user.service';
import { beforeEach, describe, expect, it } from 'vitest';
import { PrismaService } from '@/application/providers/prisma/prisma.service';

describe('Find Unique User Use Case', () => {
  let usersRepository: UsersRepository;
  let sut: FindUniqueUserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        FindUniqueUserService,
        PrismaService,
        { provide: UsersRepository, useClass: InMemoryUsersRepository },
      ],
    }).compile();

    usersRepository = moduleRef.get(UsersRepository);
    sut = moduleRef.get(FindUniqueUserService);
  });

  it('should be able to find a specific user by id', async () => {
    const password_hash = await hash('123456', 6);

    const userCreated = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash,
    });

    const { user } = await sut.execute(userCreated.id);

    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('johndoe@example.com');
  });

  it('should be able to find a specific user by email', async () => {
    const password_hash = await hash('123456', 6);

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash,
    });

    const { user } = await sut.execute('johndoe@example.com');

    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('johndoe@example.com');
  });

  it('should not be able to find user with the password', async () => {
    const password_hash = await hash('123456', 6);

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash,
    });

    const { user } = await sut.execute('johndoe@example.com');

    expect(user.name).toBe('John Doe');

    expect(user).not.toHaveProperty('password_hash');
  });
});
