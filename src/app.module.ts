import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ConfigModule } from './config/config.moduie';
import { LoggingModule } from './logging/logging.module';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from './jwt/jwt.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppFilter } from './app.filter';

import { FileModule } from './file/file.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { KeywordModule } from './keyword/keyword.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    CqrsModule.forRoot(),
    LoggingModule.forRoot(),
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(),
    JwtModule.forRoot(),
    FileModule,
    UserModule,
    EmailModule,
    KeywordModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppFilter, AppService],
})
export class AppModule {}
