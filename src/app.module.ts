import { AwsConfig, EmailConfig, JWT_CONFIG, JwtConfig, OpenApiConfig, ServerConfig, TYPEORM_CONFIG, TypeOrmConfig } from '@common/configs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ServerConfig, TypeOrmConfig, JwtConfig, AwsConfig, EmailConfig, OpenApiConfig],
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
