import { Response } from 'express';

export class DeleteTokensEvent {
  constructor(readonly res: Response) {}
}
