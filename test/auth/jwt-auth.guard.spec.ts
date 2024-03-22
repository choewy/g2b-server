import { EventHandleResultReducer, EventPublisher } from '@choewy/nestjs-event';
import { ExceptionMessage } from '@common';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from 'src/auth/guards';
import { UserTokenVerifyResult } from 'src/auth/interfaces';
import { MockContext } from 'test/utils';

const context = new MockContext().createExecutionContext();

describe('JwtAuthGuard', () => {
  let module: TestingModule;
  let publisher: EventPublisher;
  let guard: JwtAuthGuard;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [JwtAuthGuard, Reflector, { provide: EventPublisher, useValue: { publish: jest.fn() } }],
    }).compile();

    publisher = module.get(EventPublisher);
    guard = module.get(JwtAuthGuard);
  });

  beforeEach(() => {
    jest.spyOn(publisher, 'publish').mockClear();
  });

  it('JwtAuthGuard가 정의되어 있어야 한다.', () => {
    expect(guard).toBeDefined();
  });

  describe('accessToken 검증', () => {
    it('accessToken 검증이 실패하면 쿠키의 모든 토큰을 삭제하고, UnauthorizedException를 던진다.', async () => {
      jest.spyOn(publisher, 'publish').mockResolvedValueOnce(
        new EventHandleResultReducer([
          {
            context: { getHandler: () => null, getClass: () => null },
            value: {
              user: null,
              error: new JsonWebTokenError('invalid'),
              expired: false,
            } as UserTokenVerifyResult,
            error: null,
          },
        ]),
      );

      try {
        await guard.canActivate(context);
      } catch (e) {
        const exeption = e as HttpException;
        expect(exeption).toBeInstanceOf(UnauthorizedException);
        expect(exeption.getStatus()).toBe(401);
        expect(exeption.message).toBe(ExceptionMessage.FailAuth);
        expect(jest.spyOn(publisher, 'publish')).toHaveBeenCalledTimes(2);
      }
    });

    it('accessToken 검증은 성공하였으나, user 정보가 null이면 쿠키의 모든 토큰을 삭제하고, UnauthorizedException를 던진다.', async () => {
      jest.spyOn(publisher, 'publish').mockResolvedValueOnce(
        new EventHandleResultReducer([
          {
            context: { getHandler: () => null, getClass: () => null },
            value: {
              user: null,
              error: null,
              expired: false,
            } as UserTokenVerifyResult,
            error: null,
          },
        ]),
      );

      try {
        await guard.canActivate(context);
      } catch (e) {
        const exeption = e as HttpException;
        expect(exeption).toBeInstanceOf(UnauthorizedException);
        expect(exeption.getStatus()).toBe(401);
        expect(exeption.message).toBe(ExceptionMessage.FailAuth);
        expect(jest.spyOn(publisher, 'publish')).toHaveBeenCalledTimes(2);
      }
    });

    it('accessToken 검증이 실패(error가 발생하거나, user가 null인 경우)하였으나, IgnoreJwtGuardError가 활성화되어 있으면 true를 반환한다.', () => {
      jest.spyOn(module.get(Reflector), 'getAllAndOverride').mockReturnValue(true);
      jest.spyOn(publisher, 'publish').mockResolvedValueOnce(
        new EventHandleResultReducer([
          {
            context: { getHandler: () => null, getClass: () => null },
            value: {
              user: null,
              error: null,
              expired: false,
            } as UserTokenVerifyResult,
            error: null,
          },
        ]),
      );

      expect(guard.canActivate(context)).resolves.toBeTruthy();
      expect(jest.spyOn(publisher, 'publish')).toHaveBeenCalledTimes(1);
    });

    it('accessToken 검증 성공 시 true를 반환한다.', () => {
      jest.spyOn(publisher, 'publish').mockResolvedValueOnce(
        new EventHandleResultReducer([
          {
            context: { getHandler: () => null, getClass: () => null },
            value: {
              user: { id: 1, email: '' },
              error: null,
              expired: false,
            } as UserTokenVerifyResult,
            error: null,
          },
        ]),
      );

      expect(guard.canActivate(context)).resolves.toBeTruthy();
      expect(jest.spyOn(publisher, 'publish')).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessToken 만료 시 자동 갱신', () => {
    it('refreshToken 검증이 실패하면 쿠키의 모든 토큰을 삭제하고, UnauthorizedException를 던진다.', async () => {
      jest
        .spyOn(publisher, 'publish')
        .mockResolvedValueOnce(
          new EventHandleResultReducer([
            {
              context: { getHandler: () => null, getClass: () => null },
              value: {
                user: { id: 1, email: '' },
                error: null,
                expired: true,
              } as UserTokenVerifyResult,
              error: null,
            },
          ]),
        )
        .mockResolvedValueOnce(
          new EventHandleResultReducer([
            {
              context: { getHandler: () => null, getClass: () => null },
              value: {
                user: null,
                error: new JsonWebTokenError('invalid'),
                expired: false,
              } as UserTokenVerifyResult,
              error: null,
            },
          ]),
        );

      try {
        await guard.canActivate(context);
      } catch (e) {
        const exeption = e as HttpException;
        expect(exeption).toBeInstanceOf(UnauthorizedException);
        expect(exeption.getStatus()).toBe(401);
        expect(exeption.message).toBe(ExceptionMessage.FailAuth);
        expect(jest.spyOn(publisher, 'publish')).toHaveBeenCalledTimes(3);
      }
    });

    it('refreshToken 검증은 성공하였으나, user 정보가 null이면 쿠키의 모든 토큰을 삭제하고, UnauthorizedException를 던진다.', async () => {
      jest
        .spyOn(publisher, 'publish')
        .mockResolvedValueOnce(
          new EventHandleResultReducer([
            {
              context: { getHandler: () => null, getClass: () => null },
              value: {
                user: { id: 1, email: '' },
                error: null,
                expired: true,
              } as UserTokenVerifyResult,
              error: null,
            },
          ]),
        )
        .mockResolvedValueOnce(
          new EventHandleResultReducer([
            {
              context: { getHandler: () => null, getClass: () => null },
              value: {
                user: null,
                error: null,
                expired: false,
              } as UserTokenVerifyResult,
              error: null,
            },
          ]),
        );

      try {
        await guard.canActivate(context);
      } catch (e) {
        const exeption = e as HttpException;
        expect(exeption).toBeInstanceOf(UnauthorizedException);
        expect(exeption.getStatus()).toBe(401);
        expect(exeption.message).toBe(ExceptionMessage.FailAuth);
        expect(jest.spyOn(publisher, 'publish')).toHaveBeenCalledTimes(3);
      }
    });

    it('refreshToken 검증은 성공하였으나 accessToken의 user.id와 refreshToken의 user.id가 서로 다르면 쿠키의 모든 토큰을 삭제하고, UnauthorizedException를 던진다.', async () => {
      jest
        .spyOn(publisher, 'publish')
        .mockResolvedValueOnce(
          new EventHandleResultReducer([
            {
              context: { getHandler: () => null, getClass: () => null },
              value: {
                user: { id: 1, email: '' },
                error: null,
                expired: true,
              } as UserTokenVerifyResult,
              error: null,
            },
          ]),
        )
        .mockResolvedValueOnce(
          new EventHandleResultReducer([
            {
              context: { getHandler: () => null, getClass: () => null },
              value: {
                user: { id: 2, email: '' },
                error: null,
                expired: false,
              } as UserTokenVerifyResult,
              error: null,
            },
          ]),
        );

      try {
        await guard.canActivate(context);
      } catch (e) {
        const exeption = e as HttpException;
        expect(exeption).toBeInstanceOf(UnauthorizedException);
        expect(exeption.getStatus()).toBe(401);
        expect(exeption.message).toBe(ExceptionMessage.FailAuth);
        expect(jest.spyOn(publisher, 'publish')).toHaveBeenCalledTimes(3);
      }
    });

    it('refreshToken 검증 및 payload 비교 후 문제가 없으면 accessToken과 refreshToken 모두 갱신하고, true를 반환한다.', async () => {
      jest
        .spyOn(publisher, 'publish')
        .mockResolvedValueOnce(
          new EventHandleResultReducer([
            {
              context: { getHandler: () => null, getClass: () => null },
              value: {
                user: { id: 1, email: '' },
                error: null,
                expired: true,
              } as UserTokenVerifyResult,
              error: null,
            },
          ]),
        )
        .mockResolvedValueOnce(
          new EventHandleResultReducer([
            {
              context: { getHandler: () => null, getClass: () => null },
              value: {
                user: { id: 1, email: '' },
                error: null,
                expired: false,
              } as UserTokenVerifyResult,
              error: null,
            },
          ]),
        );

      expect(await guard.canActivate(context)).toBe(true);
      expect(jest.spyOn(publisher, 'publish')).toHaveBeenCalledTimes(3);
    });
  });
});
