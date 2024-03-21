import { ExecutionContext } from '@nestjs/common';

export class MockContext {
  createExecutionContext() {
    const ctx = {} as ExecutionContext;

    ctx.switchToHttp = () => ({
      getRequest: <T>() => ({} as T),
      getResponse: <T>() => ({} as T),
      getNext: jest.fn(),
    });

    return ctx;
  }
}
