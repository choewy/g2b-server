import { v4 } from 'uuid';
import { Settings } from 'luxon';

import { Injectable } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { S3ClientConfig } from '@aws-sdk/client-s3';

@Injectable()
export class ConfigFactory {
  private readonly PROCESS_ID = v4();

  constructor(private readonly configService: ConfigService) {
    Settings.defaultZone = this.configService.get('TZ');
  }

  get processId(): string {
    return this.PROCESS_ID;
  }

  get nodeEnv() {
    return this.configService.get<string>('NODE_ENV');
  }

  get isLocal(): boolean {
    return this.nodeEnv === 'local';
  }

  get isProduct(): boolean {
    return this.nodeEnv === 'product';
  }

  get corsOptions(): CorsOptions {
    return {
      origin: new RegExp(this.configService.get<string>('CORS_ORIGIN')),
      credentials: true,
    };
  }

  get typeOrmModuleOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('TYPEORM_HOST'),
      port: Number(this.configService.get<string>('TYPEORM_PORT')),
      username: this.configService.get<string>('TYPEORM_USERNAME'),
      password: this.configService.get<string>('TYPEORM_PASSWORD'),
      database: this.configService.get<string>('TYPEORM_DATABASE'),
      synchronize: this.isLocal,
      autoLoadEntities: true,
      entities: ['./dist/**/*.entity.js'],
      logging: ['error', 'warn'],
    };
  }

  get version(): string {
    return this.configService.get('VERSION');
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  get g2bApiOptions() {
    const version = this.configService.get<string>('G2B_API_VERSION');
    const url = this.configService.get<string>('G2B_API_URL');

    return {
      key: this.configService.get<string>('G2B_API_KEY'),
      url: {
        bids: `${url}/BidPublicInfoService${version}`,
        hrcs: `${url}/HrcspSsstndrdInfoService`,
      },
    };
  }

  get awsClientCredentials(): S3ClientConfig {
    return {
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    };
  }

  get awsS3Bucket(): string {
    return this.configService.get<string>('AWS_S3_BUCKET');
  }
}
