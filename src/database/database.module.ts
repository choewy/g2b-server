import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from 'src/config/config.moduie';
import { ConfigFactory } from 'src/config/config.factory';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigFactory],
      useFactory(configFactory: ConfigFactory) {
        return configFactory.typeOrmModuleOptions;
      },
    }),
  ],
})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      global: true,
    };
  }
}
