import { ApiResponseProperty } from '@nestjs/swagger';

export class SearchResultDto {
  @ApiResponseProperty({ type: String })
  key: string | null;

  @ApiResponseProperty({ type: String })
  filename: string | null;

  constructor(key: string = null, filename: string = null) {
    this.key = key;
    this.filename = filename;
  }
}
