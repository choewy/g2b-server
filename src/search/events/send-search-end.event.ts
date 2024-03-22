import { OpenApiEndDto } from 'src/openapi/dtos';

export class SendSearchEndEvent {
  constructor(readonly userId: number, readonly result: OpenApiEndDto) {}
}
