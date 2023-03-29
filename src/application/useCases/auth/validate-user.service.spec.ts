import { InMemoryUsersRepository } from '@/application/repositories/implementations/in-memory-users-repository';
import { UsersRepository } from '@/application/repositories/users-repository';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import { ValidateUserService } from './validate-user.service';

describe('Validate User Use Case', () => {
  let usersRepository: UsersRepository;
  let sut: ValidateUserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateUserService,
        { provide: UsersRepository, useClass: InMemoryUsersRepository },
      ],
    }).compile();

    usersRepository = moduleRef.get(UsersRepository);
    sut = moduleRef.get(ValidateUserService);
  });

  it('should be able to validate user', async () => {
    const password_hash = await hash('123456', 6);

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash,
    });

    const validate = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(validate.user.name).toEqual('John Doe');
  });

  it('should not be able to validate user with wrong email', async () => {
    const password_hash = await hash('123456', 6);

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash,
    });

    await expect(() =>
      sut.execute({
        email: 'wrongemail@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should not be able to validate user with wrong password', async () => {
    const password_hash = await hash('123456', 6);

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash,
    });

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should not be able to validate blocked user', async () => {
    const password_hash = await hash('123456', 6);

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash,
      is_active: false,
    });

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
