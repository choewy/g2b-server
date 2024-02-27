import { JsonWebTokenError } from 'jsonwebtoken';

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtKey } from './enums';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();

    const accessTokenResult = this.jwtService.verify(request.cookies[JwtKey.AccessToken]);

    if (accessTokenResult.payload) {
      request.id = accessTokenResult.payload.id;

      return true;
    }

    if (accessTokenResult.error.name === JsonWebTokenError.name) {
      this.jwtService.deleteTokens(response);

      throw new UnauthorizedException('인증에 실패하였습니다.', { cause: accessTokenResult.error });
    }

    const refreshTokenResult = this.jwtService.verify(request.cookies[JwtKey.RefreshToken]);

    if (refreshTokenResult.error) {
      this.jwtService.deleteTokens(response);

      throw new UnauthorizedException('다시 로그인하세요.', { cause: refreshTokenResult.error });
    }

    request.id = refreshTokenResult.payload.id;

    this.jwtService.setAccessToken(response, refreshTokenResult.payload.id);
    this.jwtService.setRefreshToken(response, refreshTokenResult.payload.id);

    return true;
  }
}
