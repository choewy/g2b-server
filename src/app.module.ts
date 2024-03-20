import { AwsConfig, EmailConfig, JwtConfig, OpenApiConfig, ServerConfig, TypeOrmConfig } from '@common/configs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ServerConfig, TypeOrmConfig, JwtConfig, AwsConfig, EmailConfig, OpenApiConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
