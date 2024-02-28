import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { HttpLogEvent } from '../implements/http-log-event';

@EventsHandler(HttpLogEvent)
export class HttpLogEventHandler implements IEventHandler<HttpLogEvent> {
  private readonly logger = new Logger('Http');

  handle(event: HttpLogEvent): void {
    if (event.exception) {
      this.logger.warn(event.toJSONString());
    } else {
      this.logger.verbose(event.toJSONString());
    }
  }
}
