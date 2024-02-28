import { BidsItem } from 'src/bids/interfaces';

export class FilteredBidsItemDto implements Omit<BidsItem, 'endPoint'> {
  id: number;
  type: string;
  keywords: string;
  bidNtceNo: string;
  bidNtceDtlUrl: string;
  bidNtceNm: string;
  ntceInsttNm: string;
  dminsttNm: string;
  cntrctCnclsMthdNm: string;
  presmptPrce: string;
  bidNtceDt: string;
  bidClseDt: string;

  constructor(i: number, { endPoint, ...item }: BidsItem) {
    Object.assign(this, item);

    this.id = i + 1;
    this.type = endPoint.name;
  }

  setKeywords(keywords: string[]): void {
    this.keywords = keywords.shift() ?? '';
  }
}
