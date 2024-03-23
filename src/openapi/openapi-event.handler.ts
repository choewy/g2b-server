import { OnEvent } from '@choewy/nestjs-event';
import { Injectable } from '@nestjs/common';

import { RunOpenApiCallEvent } from './events';
import { OpenApiService } from './openapi.service';

@Injectable()
export class OpenApiEventHandler {
  constructor(private readonly openApiService: OpenApiService) {}

  @OnEvent(RunOpenApiCallEvent)
  async handleRunOpenApiCallEvent(event: RunOpenApiCallEvent) {
    await this.openApiService.run(event.userId, event.type, event.types, event.startDate, event.endDate);
  }
}
