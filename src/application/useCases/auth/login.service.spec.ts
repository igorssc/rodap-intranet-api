import { InMemoryUsersRepository } from '@/application/repositories/implementations/in-memory-users-repository';
import { UsersRepository } from '@/application/repositories/users-repository';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import { isJWT } from 'class-validator';
import { jwtConstants } from './constants';
import { LoginService } from './login.service';

describe('Login Use Case', () => {
  let usersRepository: UsersRepository;
  let sut: LoginService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '120s' },
        }),
      ],
      providers: [
        LoginService,
        { provide: UsersRepository, useClass: InMemoryUsersRepository },
      ],
    }).compile();

    usersRepository = moduleRef.get(UsersRepository);
    sut = moduleRef.get(LoginService);
  });

  it('should be able to login', async () => {
    const password_hash = await hash('123456', 6);

    const userCreated = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash,
    });

    const login = await sut.execute(userCreated);

    expect(login.access_token).toEqual(expect.any(String));

    expect(isJWT(login.access_token)).toEqual(true);
  });
});
