import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const ReqUserEmail = createParamDecorator((_: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().email ?? null);
