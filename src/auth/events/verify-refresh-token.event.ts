import { Request } from 'express';

export class VerifyRefreshTokenEvent {
  constructor(readonly req: Request) {}
}
