import { DateTime } from 'luxon';

export class OpenApiParams {
  readonly inqryDiv: 1 | 2 = 1;
  readonly type = 'json';
  readonly numOfRows = 100;
  readonly ServiceKey: string;

  inqryBgnDt: string;
  inqryEndDt: string;
  pageNo: number;

  constructor(key: string, startDate: string, endDate: string, pageNo = 1) {
    this.ServiceKey = key;
    this.inqryBgnDt = DateTime.fromJSDate(new Date(startDate)).startOf('day').toFormat('yyyyMMddHHmm');
    this.inqryEndDt = DateTime.fromJSDate(new Date(endDate)).endOf('day').toFormat('yyyyMMddHHmm');
    this.pageNo = pageNo;
  }

  nextPage(): void {
    this.pageNo += 1;
  }
}
