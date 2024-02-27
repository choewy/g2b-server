import { SearchBidsParamsDto } from 'src/search/dto/search-bids-params.dto';

export class StartSearchBidsEvent {
  constructor(readonly searchId: number, readonly userId: number, readonly params: SearchBidsParamsDto) {}
}
