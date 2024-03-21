import { ExceptionMessage, UserEntity } from '@common';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { MockContext, MockRepository } from 'test/utils';

const context = new MockContext().createExecutionContext();

describe('JwtAuthGuard', () => {
  let module: TestingModule;
  let service: AuthService;
  let guard: JwtAuthGuard;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [JwtAuthGuard, new MockRepository(UserEntity).createProvider(), AuthService, ConfigService, JwtService],
    }).compile();

    service = module.get(AuthService);
    guard = module.get(JwtAuthGuard);
  });

  beforeEach(() => {
    jest.spyOn(service, 'deleteTokens').mockClear();
    jest.spyOn(service, 'setAccessToken').mockClear();
    jest.spyOn(service, 'setRefreshToken').mockClear();
    jest.spyOn(service, 'verifyAccessToken').mockClear();
    jest.spyOn(service, 'verifyRefreshToken').mockClear();

    jest.spyOn(service, 'deleteTokens').mockReturnValue();
    jest.spyOn(service, 'setAccessToken').mockReturnValue();
    jest.spyOn(service, 'setRefreshToken').mockReturnValue();
  });

  it('JwtAuthGuard가 정의되어 있어야 한다.', () => {
    expect(guard).toBeDefined();
  });

  describe('accessToken 검증', () => {
    it('accessToken 검증이 실패하면 쿠키의 모든 토큰을 삭제하고, UnauthorizedException를 던진다.', () => {
      jest.spyOn(service, 'verifyAccessToken').mockReturnValue({ user: null, error: new JsonWebTokenError('invalid'), expired: false });

      try {
        guard.canActivate(context);
      } catch (e) {
        const exeption = e as HttpException;

        expect(jest.spyOn(service, 'deleteTokens')).toHaveBeenCalledTimes(1);
        expect(exeption).toBeInstanceOf(UnauthorizedException);
        expect(exeption.getStatus()).toBe(401);
        expect(exeption.message).toBe(ExceptionMessage.FailAuth);
      }
    });

    it('accessToken 검증은 성공하였으나, user 정보가 null이면 쿠키의 모든 토큰을 삭제하고, UnauthorizedException를 던진다.', () => {
      jest.spyOn(service, 'verifyAccessToken').mockReturnValue({ user: null, error: null, expired: false });

      try {
        guard.canActivate(context);
      } catch (e) {
        const exeption = e as HttpException;

        expect(jest.spyOn(service, 'deleteTokens')).toHaveBeenCalledTimes(1);
        expect(exeption).toBeInstanceOf(UnauthorizedException);
        expect(exeption.getStatus()).toBe(401);
        expect(exeption.message).toBe(ExceptionMessage.FailAuth);
      }
    });

    it('accessToken 검증 성공 시 true를 반환한다.', () => {
      jest.spyOn(service, 'verifyAccessToken').mockReturnValue({ user: { id: 1, email: '' }, error: null, expired: false });

      expect(guard.canActivate(context)).toBeTruthy();
    });
  });

  describe('accessToken 만료 시 자동 갱신', () => {
    it('refreshToken 검증이 실패하면 쿠키의 모든 토큰을 삭제하고, UnauthorizedException를 던진다.', () => {
      jest.spyOn(service, 'verifyRefreshToken').mockReturnValue({ user: null, error: new JsonWebTokenError('invalid'), expired: false });

      try {
        guard.canActivate(context);
      } catch (e) {
        const exeption = e as HttpException;

        expect(jest.spyOn(service, 'deleteTokens')).toHaveBeenCalledTimes(1);
        expect(exeption).toBeInstanceOf(UnauthorizedException);
        expect(exeption.getStatus()).toBe(401);
        expect(exeption.message).toBe(ExceptionMessage.FailAuth);
      }
    });

    it('refreshToken 검증은 성공하였으나, user 정보가 null이면 쿠키의 모든 토큰을 삭제하고, UnauthorizedException를 던진다.', () => {
      jest.spyOn(service, 'verifyAccessToken').mockReturnValue({ user: { id: 1, email: '' }, error: null, expired: true });
      jest.spyOn(service, 'verifyRefreshToken').mockReturnValue({ user: null, error: null, expired: false });

      try {
        guard.canActivate(context);
      } catch (e) {
        const exeption = e as HttpException;

        expect(jest.spyOn(service, 'deleteTokens')).toHaveBeenCalledTimes(1);
        expect(exeption).toBeInstanceOf(UnauthorizedException);
        expect(exeption.getStatus()).toBe(401);
        expect(exeption.message).toBe(ExceptionMessage.FailAuth);
      }
    });

    it('refreshToken 검증은 성공하였으나 accessToken의 user.id와 refreshToken의 user.id가 서로 다르면 쿠키의 모든 토큰을 삭제하고, UnauthorizedException를 던진다.', () => {
      jest.spyOn(service, 'verifyAccessToken').mockReturnValue({ user: { id: 1, email: '' }, error: null, expired: true });
      jest.spyOn(service, 'verifyRefreshToken').mockReturnValue({ user: { id: 2, email: '' }, error: null, expired: false });

      try {
        guard.canActivate(context);
      } catch (e) {
        const exeption = e as HttpException;

        expect(jest.spyOn(service, 'deleteTokens')).toHaveBeenCalledTimes(1);
        expect(exeption).toBeInstanceOf(UnauthorizedException);
        expect(exeption.getStatus()).toBe(401);
        expect(exeption.message).toBe(ExceptionMessage.FailAuth);
      }
    });

    it('refreshToken 검증 및 payload 비교 후 문제가 없으면 accessToken과 refreshToken 모두 갱신하고, true를 반환한다.', () => {
      jest.spyOn(service, 'verifyAccessToken').mockReturnValue({ user: { id: 1, email: '' }, error: null, expired: true });
      jest.spyOn(service, 'verifyRefreshToken').mockReturnValue({ user: { id: 1, email: '' }, error: null, expired: false });

      expect(guard.canActivate(context)).toBe(true);
      expect(jest.spyOn(service, 'deleteTokens')).toHaveBeenCalledTimes(0);
      expect(jest.spyOn(service, 'setAccessToken')).toHaveBeenCalledTimes(1);
      expect(jest.spyOn(service, 'setRefreshToken')).toHaveBeenCalledTimes(1);
    });
  });
});
