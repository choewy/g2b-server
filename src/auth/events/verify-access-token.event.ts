import { Request } from 'express';

export class VerifyAccessTokenEvent {
  constructor(readonly req: Request) {}
}
