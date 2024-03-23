import { SearchEntity, SearchType } from '@common/entities';
import { ApiResponseProperty } from '@nestjs/swagger';

export class SearchDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String, enum: SearchType })
  type: SearchType;

  constructor(search: SearchEntity) {
    this.id = search.id;
    this.type = search.type;
  }
}
