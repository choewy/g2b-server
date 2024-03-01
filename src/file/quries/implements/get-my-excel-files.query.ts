import { SearchStateType } from 'src/search/entities/enums';

export class GetMyExcelFilesQuery {
  constructor(readonly userId: number, readonly type: SearchStateType) {}
}
