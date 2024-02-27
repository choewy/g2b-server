import { Settings } from 'luxon';

import { Injectable } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class ConfigFactory {
  constructor(private readonly configService: ConfigService) {
    Settings.defaultZone = this.configService.get('TZ');
  }

  get isLocal(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'local';
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
        bid: `${url}/BidPublicInfoService${version}`,
      },
    };
  }
}
