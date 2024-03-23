import { SearchType } from '@common';
import { ApiResponseProperty } from '@nestjs/swagger';

export class OpenApiItemCountsDto {
  @ApiResponseProperty({ type: String, enum: SearchType })
  type: SearchType;

  @ApiResponseProperty({ type: Number })
  total: number;

  @ApiResponseProperty({ type: Number })
  count: number;

  constructor(type: SearchType, total: number, count: number) {
    this.type = type;
    this.total = total;
    this.count = count;
  }
}
