import { Request, Response } from 'express';

import { HttpException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';

import { LoggingEvent } from 'src/logging/events/implements/logging.event';

export class Logging extends AggregateRoot {
  private now = Date.now();

  constructor(readonly context: string) {
    super();
  }

  get ms(): number {
    const now = Date.now();
    const ms = now - this.now;

    this.now = now;

    return ms;
  }

  verbose(message?: string, params?: object) {
    this.apply(new LoggingEvent('verbose', this.context, message, params));
  }

  debug(message?: string, params?: object) {
    this.apply(new LoggingEvent('debug', this.context, message, params));
    this.commit();
  }

  warn(message?: string, params?: object) {
    this.apply(new LoggingEvent('warn', this.context, message, params));
    this.commit();
  }

  error(message?: string, params?: object, error?: Error) {
    this.apply(
      new LoggingEvent('warn', this.context, message, {
        params,
        error: {
          name: error?.name,
          message: error?.message,
          cause: error?.['cause'],
          stack: error?.stack,
        },
      }),
    );

    this.commit();
  }

  http(req: Request, res: Response, exception?: HttpException) {
    const params = {
      userId: req['id'] ?? undefined,
      context: req['context'],
      request: {
        ip: req.ip,
        xforwaredfor: req.headers['x-forwared-for'],
        method: req.method,
        path: req.path,
        params: Object.keys(req.params).length > 0 ? req.params : undefined,
        searchParams: Object.keys(req.query).length > 0 ? req.query : undefined,
        body: undefined,
      },
      statusCode: -1,
      latency: Date.now() - req['requestTime'],
      exception: undefined,
    };

    if (req.body) {
      const body = { ...req.body };

      for (const key of Object.keys(body)) {
        if (key.toLowerCase().includes('password')) {
          body[key] = 'hashed';
        }
      }

      params.request.body = body;
    }

    if (exception) {
      params.statusCode = exception.getStatus();
      params.exception = exception.getResponse();
      params.exception.cause = exception.cause;
    } else {
      params.statusCode = res.statusCode;
    }

    this.apply(new LoggingEvent(exception ? 'warn' : 'verbose', this.context, exception ? 'exception' : 'http', params));
    this.commit();
  }
}
