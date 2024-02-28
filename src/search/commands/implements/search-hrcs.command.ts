import { plainToInstance } from 'class-transformer';

import { SearchHrcsParamsDto } from 'src/search/dto/search-hrcs-params.dto';
import { SearchStateType } from 'src/search/entities/enums';
import { SearchState } from 'src/search/entities/search-state.entity';

export class SearchHrcsCommand {
  constructor(readonly userId: number, readonly params: SearchHrcsParamsDto) {}

  toEntity(processId: string): SearchState {
    return plainToInstance(SearchState, {
      user: { id: this.userId },
      type: SearchStateType.Hrcs,
      processId,
    });
  }
}
