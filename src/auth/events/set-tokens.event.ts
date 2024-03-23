import { Response } from 'express';

import { UserTokenPayload } from '../interfaces';

export class SetTokensEvent {
  constructor(readonly res: Response, readonly userTokenPayload: UserTokenPayload) {}
}
