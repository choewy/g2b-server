import { SearchType } from '@common';
import { ApiResponseProperty } from '@nestjs/swagger';

export class OpenApiEndDto {
  @ApiResponseProperty({ type: String, enum: SearchType })
  type: SearchType;

  @ApiResponseProperty({ type: Error })
  error?: Error;

  constructor(type: SearchType, error?: Error) {
    this.type = type;
    this.error = error;
  }
}
