import { tap } from 'rxjs';
import { Request, Response } from 'express';

import { EventBus } from '@nestjs/cqrs';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { HttpLogEvent } from './events/implements/http-log-event';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly eventBus: EventBus) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    context.switchToHttp().getRequest().context = {
      class: context.getClass()?.name,
      handler: context.getHandler()?.name,
    };

    return next.handle().pipe(
      tap(() => {
        const http = context.switchToHttp();
        const req = http.getRequest<Request>();
        const res = http.getResponse<Response>();

        this.eventBus.publish(new HttpLogEvent(req, res));
      }),
    );
  }
}
