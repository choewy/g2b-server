import { SearchHrcsParamsDto } from 'src/search/dto/search-hrcs-params.dto';

export class StartSearchHrcsEvent {
  constructor(readonly userId: number, readonly params: SearchHrcsParamsDto) {}
}
