import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { WarnLogEvent } from '../implements/warn-log.event';

@EventsHandler(WarnLogEvent)
export class WarnLogEventHandler implements IEventHandler<WarnLogEvent> {
  private readonly logger = new Logger('Warn');

  handle(event: WarnLogEvent): void {
    this.logger.warn(event.toJSONString());
  }
}
