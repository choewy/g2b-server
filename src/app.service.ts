import { Injectable } from '@nestjs/common';

import { ConfigFactory } from './config/config.factory';

@Injectable()
export class AppService {
  constructor(private readonly configFactory: ConfigFactory) {}

  getVersion(): string {
    return this.configFactory.version;
  }
}
