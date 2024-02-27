import { Response } from 'express';

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException } from '@nestjs/common';

@Catch(HttpException, Error)
export class AppFilter implements ExceptionFilter {
  catch(e: HttpException | Error, host: ArgumentsHost) {
    let exception = e as HttpException;

    if (exception instanceof HttpException === false) {
      exception = new InternalServerErrorException('서버 오류가 발생하였습니다.', { cause: e });
    }

    return host.switchToHttp().getResponse<Response>().status(exception.getStatus()).send({
      message: exception.message,
      statusCode: exception.getStatus(),
      cause: exception.cause,
    });
  }
}
