import { DynamicModule, Module } from '@nestjs/common';

import { LoggingInterceptor } from './logging.interceptor';
import { VerboseLogEventHandler } from './events/handlers/verbose-log.event.handler';
import { WarnLogEventHandler } from './events/handlers/warn-log.event.handler';
import { ErrorLogEventHandler } from './events/handlers/error-log.event.handler';
import { HttpLogEventHandler } from './events/handlers/http-log.event.handler';

const EventHandlers = [VerboseLogEventHandler, WarnLogEventHandler, ErrorLogEventHandler, HttpLogEventHandler];

@Module({
  providers: [LoggingInterceptor, ...EventHandlers],
  exports: [LoggingInterceptor],
})
export class LoggingModule {
  static forRoot(): DynamicModule {
    return {
      module: LoggingModule,
      global: true,
    };
  }
}
