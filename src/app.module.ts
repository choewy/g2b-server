import {
  AwsConfig,
  EmailConfig,
  JWT_CONFIG,
  JwtConfig,
  OpenApiConfig,
  ServerConfig,
  SystemConfig,
  TYPEORM_CONFIG,
  TypeOrmConfig,
} from '@common/configs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { ExcelModule } from './excel/excel.module';
import { KeywordModule } from './keyword/keyword.module';
import { SearchModule } from './search/search.module';
import { UserModule } from './user/user.module';

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
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return config.get(JWT_CONFIG);
      },
    }),
    UserModule,
    EmailModule,
    KeywordModule,
    SearchModule,
    ExcelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
