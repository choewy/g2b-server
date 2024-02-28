import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ConfigModule } from './config/config.moduie';
import { LoggingModule } from './logging/logging.module';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from './jwt/jwt.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { KeywordModule } from './keyword/keyword.module';
import { SearchModule } from './search/search.module';
import { AppFilter } from './app.filter';

@Module({
  imports: [
    CqrsModule.forRoot(),
    LoggingModule.forRoot(),
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(),
    JwtModule.forRoot(),
    UserModule,
    KeywordModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppFilter, AppService],
})
export class AppModule {}
