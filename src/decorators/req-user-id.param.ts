import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const ReqUserID = createParamDecorator((_: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().id ?? null);
