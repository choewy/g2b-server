import { Response } from 'express';

export class GetUserWithSignInQuery {
  constructor(readonly res: Response, readonly email: string, readonly password: string) {}
}
