/* eslint-disable @typescript-eslint/no-unused-vars */

import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

export class TestAuthService extends AuthService {
  createAccessToken(id: number, email: string): string {
    return 'jwt-access-token';
  }

  createRefreshToken(id: number, email: string): string {
    return 'jwt-refresh-token';
  }

  comparePassword(commandPassword: string, userPassword: string): boolean {
    return true;
  }

  setAccessToken(res: Response<any, Record<string, any>>, id: number, email: string): void {
    return;
  }

  setRefreshToken(res: Response<any, Record<string, any>>, id: number, email: string): void {
    return;
  }

  deleteTokens(res: Response<any, Record<string, any>>): void {
    return;
  }
}
