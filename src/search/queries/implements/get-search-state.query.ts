import { SearchStateType } from 'src/search/entities/enums';

export class GetSearchStateQuery {
  constructor(readonly userId: number, readonly type: SearchStateType) {}
}
