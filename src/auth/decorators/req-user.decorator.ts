import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserTokenPayload } from '../interfaces';

export const ReqUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserTokenPayload => ctx.switchToHttp().getRequest().user ?? null,
);
