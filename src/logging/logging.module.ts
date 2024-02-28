import { DynamicModule, Module } from '@nestjs/common';

import { LoggingService } from './logging.service';
import { LoggingInterceptor } from './logging.interceptor';
import { LoggingEventHandler } from './events/handlers/logging.event.handler';

const EventHandlers = [LoggingEventHandler];

@Module({
  providers: [LoggingService, LoggingInterceptor, ...EventHandlers],
  exports: [LoggingService, LoggingInterceptor],
})
export class LoggingModule {
  static forRoot(): DynamicModule {
    return {
      module: LoggingModule,
      global: true,
    };
  }
}
