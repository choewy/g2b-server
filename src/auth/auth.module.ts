import { JWT_CONFIG, UserEntity } from '@common';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthEventHandler } from './auth-event.handler';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards';

@Module({})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: AuthModule,
      imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.registerAsync({
          global: true,
          inject: [ConfigService],
          useFactory(config: ConfigService) {
            return config.get(JWT_CONFIG);
          },
        }),
      ],
      controllers: [AuthController],
      providers: [JwtAuthGuard, AuthService, AuthEventHandler],
      exports: [JwtAuthGuard, AuthService],
    };
  }
}
