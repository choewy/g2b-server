import { Response } from 'express';

import { SignInDto } from 'src/user/dto/sign-in.dto';

export class GetUserWithSignInQuery {
  constructor(readonly res: Response, readonly body: SignInDto) {}
}
