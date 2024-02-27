import { ApiResponseProperty } from '@nestjs/swagger';

export class KeywordIdDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}
