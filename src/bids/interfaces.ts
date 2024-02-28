export const BidsItemField = {
  bidNtceNo: '입찰공고번호',
  bidNtceDtlUrl: '입찰공고URL',
  bidNtceNm: '입찰공고명',
  ntceInsttNm: '공고기관명',
  dminsttNm: '수요기관명',
  cntrctCnclsMthdNm: '계약체결방법',
  presmptPrce: '추정가격',
  bidNtceDt: '입찰공고일시',
  bidClseDt: '입찰마감일시',
} as const;

export interface BidsEndPoint {
  name: string;
  path: string;
}

export interface BidsItem extends Readonly<Record<keyof typeof BidsItemField, string>> {
  id: number;
  type: string;
  endPoint: BidsEndPoint;
}

export interface BidsResponseBody {
  pageNo: number;
  numOfRows: number;
  totalCount: number;
  items: BidsItem[];
}

export interface BidsResponse {
  response: { body: BidsResponseBody };
}
