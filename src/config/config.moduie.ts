import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule as NestJSConfigModule } from '@nestjs/config';

import { ConfigFactory } from './config.factory';

@Module({
  imports: [NestJSConfigModule.forRoot()],
  providers: [ConfigFactory],
  exports: [ConfigFactory],
})
export class ConfigModule {
  static forRoot(): DynamicModule {
    return {
      module: ConfigModule,
      global: true,
    };
  }
}
