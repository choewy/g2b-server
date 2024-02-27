import { DateTime } from 'luxon';
import { Response } from 'express';
import { JsonWebTokenError, JwtPayload, TokenExpiredError, sign, verify } from 'jsonwebtoken';

import { Injectable } from '@nestjs/common';

import { ConfigFactory } from 'src/config/config.factory';

import { JwtKey } from './enums';

@Injectable()
export class JwtService<G2bJwtPayload = JwtPayload & { id: number }> {
  constructor(private readonly configFactory: ConfigFactory) {}

  sign(type: JwtKey, id: number): string {
    let expiresIn: string;

    switch (type) {
      case JwtKey.AccessToken:
        expiresIn = '1d';
        break;

      case JwtKey.RefreshToken:
        expiresIn = '14d';
        break;
    }

    return sign({ id }, this.configFactory.jwtSecret, { expiresIn });
  }

  verify(token: string): {
    payload: G2bJwtPayload | null;
    error: JsonWebTokenError | TokenExpiredError | null;
  } {
    try {
      return { payload: verify(token, this.configFactory.jwtSecret) as G2bJwtPayload, error: null };
    } catch (e) {
      return { payload: null, error: e as JsonWebTokenError | TokenExpiredError };
    }
  }

  setAccessToken(res: Response, id: number): void {
    res.cookie(JwtKey.AccessToken, this.sign(JwtKey.AccessToken, id), {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: DateTime.local().plus({ days: 1 }).toJSDate(),
    });
  }

  setRefreshToken(res: Response, id: number): void {
    res.cookie(JwtKey.RefreshToken, this.sign(JwtKey.RefreshToken, id), {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: DateTime.local().plus({ days: 14 }).toJSDate(),
    });
  }

  deleteTokens(res: Response): void {
    res.clearCookie(JwtKey.AccessToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.clearCookie(JwtKey.RefreshToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }
}
