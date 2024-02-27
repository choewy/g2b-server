import { BidItem } from 'src/bids/interfaces';

export class FilteredBidsItemDto implements Omit<BidItem, 'endPoint'> {
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

  constructor(i: number, { endPoint, ...item }: BidItem) {
    Object.assign(this, item);

    this.id = i + 1;
    this.type = endPoint.name;
  }

  setKeywords(keywords: string[]) {
    this.keywords = keywords.join(', ');
  }
}
