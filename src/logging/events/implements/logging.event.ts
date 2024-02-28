import { Logger } from '@nestjs/common';

export class LoggingEvent {
  readonly logger: Logger;

  constructor(
    readonly level: keyof Pick<Logger, 'verbose' | 'debug' | 'warn' | 'error'>,
    readonly context: string,
    readonly message?: string,
    readonly params?: object,
  ) {
    this.logger = new Logger(context);
  }

  toJSONString() {
    return JSON.stringify(
      {
        context: this.context,
        message: this.message,
        ...this.params,
      },
      null,
      2,
    );
  }
}
