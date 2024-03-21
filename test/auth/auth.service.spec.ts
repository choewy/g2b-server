import { ExceptionMessage, UserDto, UserEntity } from '@common';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { SignInCommand } from 'src/auth/commands';
import { MockRepository, MockResponse } from 'test/utils';

import { TestAuthService } from './auth.service';

const response = new MockResponse();
const userRepository = new MockRepository(UserEntity);

describe('AuthService', () => {
  let module: TestingModule;
  let context: TestAuthService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [TestAuthService, userRepository.createProvider(), ConfigService, JwtService],
    }).compile();
    context = module.get(TestAuthService);
  });

  it('AuthService가 정의되어 있어야 한다.', () => {
    expect(context).toBeDefined();
  });

  describe('getUser', () => {
    beforeEach(() => {
      jest.spyOn(userRepository.from(module), 'findOneBy').mockClear();
      jest.spyOn(context, 'deleteTokens').mockClear();
    });

    it('id가 1인 UserEntity가 없으면 Cookie의 모든 토큰을 삭제한 후 UnauthorizedException을 던진다.', async () => {
      jest.spyOn(userRepository.from(module), 'findOneBy').mockResolvedValue(null);

      await context.getUser(response, 1).catch((e: HttpException) => {
        expect(jest.spyOn(context, 'deleteTokens')).toHaveBeenCalledTimes(1);
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.getStatus()).toBe(401);
        expect(e.message).toBe(ExceptionMessage.NotFoundAuth);
      });
    });

    it('id가 1인 UserEntity를 찾으면 UserDto을 반환한다.', async () => {
      const user = plainToInstance(UserEntity, { name: 'choewy' });

      jest.spyOn(userRepository.from(module), 'findOneBy').mockResolvedValue(user);

      await context.getUser(response, 1).then((value) => {
        expect(value).toBeInstanceOf(UserDto);
        expect(value).toEqual(new UserDto(user));
      });
    });
  });

  describe('signin', () => {
    beforeEach(() => {
      jest.spyOn(userRepository.from(module), 'findOneBy').mockClear();
      jest.spyOn(context, 'comparePassword').mockClear();
      jest.spyOn(context, 'setAccessToken').mockClear();
      jest.spyOn(context, 'setRefreshToken').mockClear();
    });

    it('email이 test@example.com인 UserEntity가 없으면 UnauthorizedException을 던진다.', async () => {
      jest.spyOn(userRepository.from(module), 'findOneBy').mockResolvedValue(null);

      await context.signIn(response, plainToInstance(SignInCommand, { email: 'test@example.com' })).catch((e: HttpException) => {
        expect(jest.spyOn(context, 'comparePassword')).toHaveBeenCalledTimes(0);
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.getStatus()).toBe(401);
        expect(e.message).toBe(ExceptionMessage.WrongEmailOrPassword);
      });
    });

    it('email이 test@example.com인 UserEntity를 찾았으나 비밀번호가 일치하지 않으면 UnauthorizedException을 던진다.', async () => {
      jest.spyOn(userRepository.from(module), 'findOneBy').mockResolvedValue(new UserEntity());
      jest.spyOn(context, 'comparePassword').mockReturnValue(false);

      await context
        .signIn(response, plainToInstance(SignInCommand, { email: 'test@example.com', password: 'example' }))
        .catch((e: HttpException) => {
          expect(jest.spyOn(context, 'comparePassword')).toHaveBeenCalledTimes(1);
          expect(e).toBeInstanceOf(UnauthorizedException);
          expect(e.getStatus()).toBe(401);
          expect(e.message).toBe(ExceptionMessage.WrongEmailOrPassword);
        });
    });

    it('로그인에 성공하면 accessToken과 refreshToken을 Cookie에 등록하고, UserDto를 반환한다.', async () => {
      jest.spyOn(userRepository.from(module), 'findOneBy').mockResolvedValue(new UserEntity());
      jest.spyOn(context, 'comparePassword').mockReturnValue(true);

      await context
        .signIn(response, plainToInstance(SignInCommand, { email: 'test@example.com', password: 'example' }))
        .then((dto: UserDto) => {
          expect(jest.spyOn(context, 'comparePassword')).toHaveBeenCalledTimes(1);
          expect(jest.spyOn(context, 'setAccessToken')).toHaveBeenCalledTimes(1);
          expect(jest.spyOn(context, 'setRefreshToken')).toHaveBeenCalledTimes(1);
          expect(dto).toBeInstanceOf(UserDto);
        });
    });
  });
});
