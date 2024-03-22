import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { OpenApiEventHandler } from './openapi-event.handler';
import { OpenApiService } from './openapi.service';

@Module({
  imports: [HttpModule],
  providers: [OpenApiService, OpenApiEventHandler],
})
export class OpenApiModule {}
