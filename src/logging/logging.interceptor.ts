import { tap } from 'rxjs';
import { Request, Response } from 'express';

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { LoggingService } from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    context.switchToHttp().getRequest().requestTime = Date.now();
    context.switchToHttp().getRequest().context = [context.getClass()?.name, context.getHandler()?.name]
      .filter((context) => context)
      .join('.');

    return next.handle().pipe(
      tap(() => {
        const http = context.switchToHttp();
        const req = http.getRequest<Request>();
        const res = http.getResponse<Response>();

        this.loggingService.create('HTTP').http(req, res);
      }),
    );
  }
}
