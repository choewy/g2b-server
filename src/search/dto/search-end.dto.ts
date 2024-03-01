import { ApiResponseProperty } from '@nestjs/swagger';

import { SearchStateType } from '../entities/enums';

export class SearchEndDto {
  @ApiResponseProperty({ type: String, enum: SearchStateType })
  type: SearchStateType;

  @ApiResponseProperty({ type: Error })
  error?: Error;

  constructor(type: SearchStateType, error?: unknown) {
    this.type = type;
    this.error = error as Error;
  }
}
