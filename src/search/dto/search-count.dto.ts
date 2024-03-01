import { ApiResponseProperty } from '@nestjs/swagger';

import { SearchStateType } from '../entities/enums';

export class SearchCountDto {
  @ApiResponseProperty({ type: String, enum: SearchStateType })
  type: SearchStateType;

  @ApiResponseProperty({ type: Number })
  count: number;

  constructor(type: SearchStateType, count: number) {
    this.type = type;
    this.count = count;
  }
}
