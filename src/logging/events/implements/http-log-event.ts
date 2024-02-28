import { Request, Response } from 'express';

import { HttpException } from '@nestjs/common';

export class HttpLogEvent {
  constructor(readonly req: Request, readonly res: Response, readonly exception?: HttpException) {}

  toJSONString(): string {
    const log = {
      userId: this.req['id'] ?? undefined,
      context: this.req['context'],
      request: {
        ip: this.req.ip,
        xforwaredfor: this.req.headers['x-forwared-for'],
        method: this.req.method,
        path: this.req.path,
        params: Object.keys(this.req.params).length > 0 ? this.req.params : undefined,
        searchParams: Object.keys(this.req.query).length > 0 ? this.req.query : undefined,
        body: Object.keys(this.req.query).length > 0 ? this.req.body : undefined,
      },
      response: undefined,
      exception: undefined,
    };

    if (this.exception) {
      log.exception = this.exception.getResponse();
    } else {
      log.response = {
        statusCode: this.res.statusCode,
      };
    }

    return JSON.stringify(log, null, 2);
  }
}
