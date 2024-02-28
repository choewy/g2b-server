import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { VerboseLogEvent } from '../implements/verbose-log.event';

@EventsHandler(VerboseLogEvent)
export class VerboseLogEventHandler implements IEventHandler<VerboseLogEvent> {
  private readonly logger = new Logger('Verbose');

  handle(event: VerboseLogEvent): void {
    this.logger.verbose(event.toJSONString());
  }
}
