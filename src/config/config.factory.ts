import { Injectable } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class ConfigFactory {
  constructor(private readonly configService: ConfigService) {}

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
      port: this.configService.get<number>('TYPEORM_PORT'),
      username: this.configService.get<string>('TYPEORM_USERNAME'),
      password: this.configService.get<string>('TYPEORM_PASSWORD'),
      database: this.configService.get<string>('TYPEORM_DATABASE'),
      synchronize: this.isLocal,
      autoLoadEntities: true,
      entities: ['./dist/**/*.entity.js'],
    };
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }
}
