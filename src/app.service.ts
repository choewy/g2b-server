import { existsSync, readFileSync } from 'fs';

import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  private version: string;

  onModuleInit() {
    if (existsSync('./package.json') === false) {
      return;
    }

    const pkg = readFileSync('./package.json').toString('utf-8');

    this.version = JSON.parse(pkg).version;
  }

  getVersion() {
    return { version: this.version ?? null };
  }
}
