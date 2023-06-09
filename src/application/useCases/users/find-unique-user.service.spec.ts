import { InMemoryUsersRepository } from '@/application/repositories/implementations/in-memory-users-repository';
import { UsersRepository } from '@/application/repositories/users-repository';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import { FindUniqueUserService } from './find-unique-user.service';

describe('Find Unique User Use Case', () => {
  let usersRepository: UsersRepository;
  let sut: FindUniqueUserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        FindUniqueUserService,
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

    const user = await sut.execute(userCreated.id);

    expect(user).toMatchObject(userCreated);
    expect(user.name).toEqual('John Doe');
  });

  it('should be able to find a specific user by email', async () => {
    const password_hash = await hash('123456', 6);

    const userCreated = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash,
    });

    const user = await sut.execute('johndoe@example.com');

    expect(user).toMatchObject(userCreated);
    expect(user.name).toEqual('John Doe');
  });
});
