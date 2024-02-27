import { JwtPayload, sign, verify } from 'jsonwebtoken';

import { Injectable, UnauthorizedException } from '@nestjs/common';

import { ConfigFactory } from 'src/config/config.factory';

@Injectable()
export class JwtService<G2bJwtPayload = JwtPayload & { id: number }> {
  constructor(private readonly configFactory: ConfigFactory) {}

  sign(id: number): string {
    return sign({ id }, this.configFactory.jwtSecret, { expiresIn: '1d' });
  }

  verify(token: string) {
    try {
      return verify(token, this.configFactory.jwtSecret) as G2bJwtPayload;
    } catch (e) {
      throw new UnauthorizedException('인증에 실패하였습니다.', { cause: e });
    }
  }
}
