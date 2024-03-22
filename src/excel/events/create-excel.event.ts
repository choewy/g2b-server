import { SearchType } from '@common';
import { OpenApiBidsFilteredItem, OpenApiHrcsFilteredItem } from 'src/openapi/implements';

export class CreateExcelEvent {
  constructor(
    readonly userId: number,
    readonly type: SearchType,
    readonly filteredItems: (OpenApiBidsFilteredItem | OpenApiHrcsFilteredItem)[],
    readonly startDate: string,
    readonly endDate: string,
  ) {}
}
