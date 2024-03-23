import { EventPublisher } from '@choewy/nestjs-event';
import { ExceptionMessage } from '@common';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';

import { IGNORE_JWT_GUARD_ERROR } from '../decorators';
import { DeleteTokensEvent, SetTokensEvent, VerifyAccessTokenEvent, VerifyRefreshTokenEvent } from '../events';
import { UserTokenVerifyResult } from '../interfaces';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly eventPublisher: EventPublisher) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const accessTokenResults = await this.eventPublisher.publish(new VerifyAccessTokenEvent(req));
    const accessTokenResult = accessTokenResults.getFirstValue() as UserTokenVerifyResult;

    if (accessTokenResult.error || accessTokenResult.user === null) {
      const ignoreJwtGuardError = this.reflector.getAllAndOverride(IGNORE_JWT_GUARD_ERROR, [context.getClass(), context.getHandler()]);

      if (ignoreJwtGuardError === true) {
        return true;
      }

      await this.eventPublisher.publish(new DeleteTokensEvent(res));
      throw new UnauthorizedException(ExceptionMessage.FailAuth, {
        cause: {
          name: accessTokenResult.error?.name,
          message: accessTokenResult.error?.message ?? 'empty user',
        },
      });
    }

    req['user'] = { id: accessTokenResult.user.id, email: accessTokenResult.user.email };

    if (accessTokenResult.expired === false) {
      return true;
    }

    const refreshTokenResults = await this.eventPublisher.publish(new VerifyRefreshTokenEvent(req));
    const refreshTokenResult = refreshTokenResults.getFirstValue() as UserTokenVerifyResult;

    if (refreshTokenResult.error || refreshTokenResult.user === null) {
      await this.eventPublisher.publish(new DeleteTokensEvent(res));
      throw new UnauthorizedException(ExceptionMessage.FailAuth, {
        cause: {
          name: refreshTokenResult.error?.name,
          message: refreshTokenResult.error?.message ?? 'empty user',
        },
      });
    }

    if (accessTokenResult.user?.id !== refreshTokenResult.user?.id) {
      await this.eventPublisher.publish(new DeleteTokensEvent(res));
      throw new UnauthorizedException(ExceptionMessage.FailAuth, {
        cause: {
          accessTokenPayload: accessTokenResult.user,
          refreshTokenPayload: refreshTokenResult.user,
        },
      });
    }

    await this.eventPublisher.publish(new SetTokensEvent(res, accessTokenResult.user));

    return true;
  }
}
