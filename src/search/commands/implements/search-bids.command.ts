import { plainToInstance } from 'class-transformer';

import { SearchBidsParamsDto } from 'src/search/dto/search-bids-params.dto';
import { SearchStateType } from 'src/search/entities/enums';
import { SearchState } from 'src/search/entities/search-state.entity';

export class SearchBidsCommand {
  constructor(readonly userId: number, readonly params: SearchBidsParamsDto) {}

  toEntity(): SearchState {
    return plainToInstance(SearchState, {
      type: SearchStateType.Bids,
      user: { id: this.userId },
    });
  }
}
