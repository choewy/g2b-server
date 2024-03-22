import { EventModule } from '@choewy/nestjs-event';
import {
  AwsConfig,
  EmailConfig,
  JwtConfig,
  OpenApiConfig,
  ServerConfig,
  SystemConfig,
  TYPEORM_CONFIG,
  TypeOrmConfig,
} from '@common/configs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ExcelModule } from './excel/excel.module';
import { KeywordModule } from './keyword/keyword.module';
import { OpenApiModule } from './openapi/openapi.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [SystemConfig, ServerConfig, TypeOrmConfig, JwtConfig, AwsConfig, EmailConfig, OpenApiConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return config.get(TYPEORM_CONFIG);
      },
    }),
    EventModule.register({ global: true }),
    AuthModule,
    EmailModule,
    KeywordModule,
    SearchModule,
    OpenApiModule,
    ExcelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
