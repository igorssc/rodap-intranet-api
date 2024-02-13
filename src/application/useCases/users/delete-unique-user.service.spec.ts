import { InMemoryUsersRepository } from '@/application/repositories/implementations/in-memory-users-repository';
import { UsersRepository } from '@/application/repositories/users-repository';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import { DeleteUniqueUserService } from './delete-unique-user.service';

describe('Delete Unique User Use Case', () => {
  let usersRepository: UsersRepository;
  let sut: DeleteUniqueUserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUniqueUserService,
        { provide: UsersRepository, useClass: InMemoryUsersRepository },
      ],
    }).compile();

    usersRepository = moduleRef.get(UsersRepository);
    sut = moduleRef.get(DeleteUniqueUserService);
  });

  it('should be able to delete a user', async () => {
    const password_hash = await hash('123456', 6);

    const userCreated = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash,
    });

    const deletedUser = await sut.execute(userCreated.id);

    expect(deletedUser.id).toEqual(userCreated.id);
    expect(deletedUser.name).toEqual('John Doe');

    const listUsers = await usersRepository.findAll({ page: 1, pageSize: 10 });

    await expect(listUsers.length).toBe(0);
  });
});
