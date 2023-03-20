import { InMemoryUsersRepository } from '@/application/repositories/implementations/in-memory-users-repository';
import { UsersRepository } from '@/application/repositories/users-repository';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import { CreateUserService } from './create-user.service';
import { FindAllUsersService } from './find-all-users.service';

describe('Find All Users Use Case', () => {
  let usersRepository: UsersRepository;
  let sut: FindAllUsersService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        FindAllUsersService,
        CreateUserService,
        { provide: UsersRepository, useClass: InMemoryUsersRepository },
      ],
    }).compile();

    usersRepository = moduleRef.get(UsersRepository);
    sut = moduleRef.get(FindAllUsersService);
  });

  it('should be able to find all a users', async () => {
    const password_hash = await hash('123456', 6);

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash,
    });

    const userList = await sut.execute();

    expect(userList).toHaveLength(1);
    expect(userList[0].name).toBe('John Doe');
  });
});
