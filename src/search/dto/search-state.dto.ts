import { ApiResponseProperty } from '@nestjs/swagger';

import { SearchStateType } from '../entities/enums';
import { SearchState } from '../entities/search-state.entity';

export class SearchStateDto {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String, enum: SearchStateType })
  type: SearchStateType;

  constructor(searchState: SearchState) {
    this.id = searchState.id;
    this.type = searchState.type;
  }
}
