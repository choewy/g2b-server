import { Request, Response } from 'express';

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException } from '@nestjs/common';

import { LoggingService } from './logging/logging.service';

@Catch(HttpException, Error)
export class AppFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(e: HttpException | Error, host: ArgumentsHost) {
    let exception = e as HttpException;

    if (exception instanceof HttpException === false) {
      exception = new InternalServerErrorException(undefined, {
        description: e.name,
        cause: {
          name: e.name,
          message: e.message,
          stack: e.stack,
        },
      });
    }

    const http = host.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    this.loggingService.create('Exception').http(req, res, exception);

    return res.status(exception.getStatus()).send(exception.getResponse());
  }
}
