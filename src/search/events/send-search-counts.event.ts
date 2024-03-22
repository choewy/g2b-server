import { OpenApiItemCountsDto } from 'src/openapi/dtos';

export class SendSearchCountsEvent {
  constructor(readonly userId: number, readonly counts: OpenApiItemCountsDto) {}
}
