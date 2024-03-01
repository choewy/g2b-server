import { SearchStateType } from 'src/search/entities/enums';

export class EndSearchEvent {
  constructor(readonly userId: number, readonly type: SearchStateType, readonly error?: unknown) {}
}
