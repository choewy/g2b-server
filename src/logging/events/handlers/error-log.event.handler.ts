import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ErrorLogEvent } from '../implements/error-log.event';

@EventsHandler(ErrorLogEvent)
export class ErrorLogEventHandler implements IEventHandler<ErrorLogEvent> {
  private readonly logger = new Logger('Error');

  handle(event: ErrorLogEvent): void {
    this.logger.warn(event.toJSONString());
  }
}
