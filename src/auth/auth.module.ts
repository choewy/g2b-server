import { JWT_CONFIG, UserEntity } from '@common';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthEventHandler } from './auth-event.handler';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return config.get(JWT_CONFIG);
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthEventHandler],
})
export class AuthModule {}
