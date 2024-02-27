import { Response } from 'express';

export class GetUserWithAuthQuery {
  constructor(readonly res: Response, readonly id: number) {}
}
