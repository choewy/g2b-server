import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { LoggingEvent } from '../implements/logging.event';

@EventsHandler(LoggingEvent)
export class LoggingEventHandler implements IEventHandler<LoggingEvent> {
  handle(event: LoggingEvent): void {
    event.logger[event.level](event.toObject());
  }
}
