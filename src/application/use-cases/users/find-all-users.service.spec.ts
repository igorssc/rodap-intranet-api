import { InMemoryUsersRepository } from '@/application/repositories/implementations/in-memory-users.repository';
import { UsersRepository } from '@/application/repositories/users.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import { FindAllUsersService } from './find-all-users.service';
import { beforeEach, describe, expect, it } from 'vitest';
import { PrismaService } from '@/application/providers/prisma/prisma.service';

describe('Find All Users Use Case', () => {
  let usersRepository: UsersRepository;
  let sut: FindAllUsersService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllUsersService,
        PrismaService,
        { provide: UsersRepository, useClass: InMemoryUsersRepository },
      ],
    }).compile();

    usersRepository = moduleRef.get(UsersRepository);
    sut = moduleRef.get(FindAllUsersService);
  });

  it('should be able to find all a users without current user', async () => {
    const password_hash = await hash('123456', 6);

    const currentUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash,
    });

    await usersRepository.create({
      name: 'Alice Smith',
      email: 'johndoe2@example.com',
      password_hash,
    });

    const usersList = await sut.execute({
      hiddenId: currentUser.id,
    });

    const expectedResult = {
      totalDocs: 1,
      limit: 10,
      totalPages: 1,
      page: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };

    Object.keys(expectedResult).forEach((key) =>
      expect(usersList[key]).toBe(expectedResult[key]),
    );

    expect(usersList.data).toHaveLength(1);
    expect(usersList.data[0].name).toBe('Alice Smith');
  });

  it('should be able to find all a users with current user', async () => {
    const password_hash = await hash('123456', 6);

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash,
    });

    const usersList = await sut.execute();

    const expectedResult = {
      totalDocs: 1,
      limit: 10,
      totalPages: 1,
      page: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };

    Object.keys(expectedResult).forEach((key) =>
      expect(usersList[key]).toBe(expectedResult[key]),
    );

    expect(usersList.data).toHaveLength(1);
    expect(usersList.data[0].name).toBe('John Doe');
  });

  it('should be able to find all a users on another page', async () => {
    const password_hash = await hash('123456', 6);

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash,
    });

    await usersRepository.create({
      name: 'Alice Smith',
      email: 'johndoe2@example.com',
      password_hash,
    });

    const usersList = await sut.execute({
      limit: 1,
      page: 2,
    });

    const expectedResult = {
      totalDocs: 2,
      limit: 1,
      totalPages: 2,
      page: 2,
      hasPrevPage: true,
      hasNextPage: false,
      prevPage: 1,
      nextPage: null,
    };

    Object.keys(expectedResult).forEach((key) =>
      expect(usersList[key]).toBe(expectedResult[key]),
    );

    expect(usersList.data).toHaveLength(1);
    expect(usersList.data[0].name).toBe('Alice Smith');
  });

  it('should not be able to return all users with the password', async () => {
    const password_hash = await hash('123456', 6);

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash,
    });

    const usersList = await sut.execute();

    expect(usersList.data).toHaveLength(1);
    expect(usersList.data[0].name).toBe('John Doe');

    expect(usersList.data[0]).not.toHaveProperty('password_hash');
  });
});
