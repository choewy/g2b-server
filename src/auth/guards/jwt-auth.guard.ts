import { ExceptionMessage } from '@common';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const accessTokenResult = this.authService.verifyAccessToken(req);

    if (accessTokenResult.error || accessTokenResult.user === null) {
      this.authService.deleteTokens(res);
      throw new UnauthorizedException(ExceptionMessage.FailAuth, {
        cause: {
          name: accessTokenResult.error?.name,
          message: accessTokenResult.error?.message ?? 'empty user',
        },
      });
    }

    req['user'] = {
      id: accessTokenResult.user.id,
      email: accessTokenResult.user.email,
    };

    if (accessTokenResult.expired === false) {
      return true;
    }

    const refreshTokenResult = this.authService.verifyRefreshToken(req);

    if (refreshTokenResult.error || refreshTokenResult.user === null) {
      this.authService.deleteTokens(res);

      throw new UnauthorizedException(ExceptionMessage.FailAuth, {
        cause: {
          name: refreshTokenResult.error?.name,
          message: refreshTokenResult.error?.message ?? 'empty user',
        },
      });
    }

    if (accessTokenResult.user?.id !== refreshTokenResult.user?.id) {
      this.authService.deleteTokens(res);

      throw new UnauthorizedException(ExceptionMessage.FailAuth, {
        cause: {
          accessTokenPayload: accessTokenResult.user,
          refreshTokenPayload: refreshTokenResult.user,
        },
      });
    }

    this.authService.setAccessToken(res, accessTokenResult.user.id, accessTokenResult.user.email);
    this.authService.setRefreshToken(res, accessTokenResult.user.id, accessTokenResult.user.email);

    return true;
  }
}
