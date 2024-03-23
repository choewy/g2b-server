import { KeywordEntity } from '@common';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OpenApiEventHandler } from './openapi-event.handler';
import { OpenApiService } from './openapi.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([KeywordEntity])],
  providers: [OpenApiService, OpenApiEventHandler],
})
export class OpenApiModule {}
