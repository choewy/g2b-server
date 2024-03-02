import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HttpHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class PingHealthIndicator extends HealthIndicator {
  constructor(private readonly httpHealthIndicator: HttpHealthIndicator) {
    super();
  }

  async pingCheck(key: string, url: string) {
    return this.httpHealthIndicator
      .pingCheck(key, url)
      .then(() => this.getStatus(key, true))
      .catch((e) => {
        throw new HealthCheckError(e.name, e.causes);
      });
  }
}
