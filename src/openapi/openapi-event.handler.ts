import { Injectable } from '@nestjs/common';

import { OpenApiService } from './openapi.service';

@Injectable()
export class OpenApiEventHandler {
  constructor(private readonly openApiService: OpenApiService) {}
}
