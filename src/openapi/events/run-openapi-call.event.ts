import { SearchType } from '@common';

export class RunOpenApiCallEvent {
  constructor(
    readonly userId: number,
    readonly type: SearchType,
    readonly types: number[],
    readonly startDate: string,
    readonly endDate: string,
  ) {}
}
