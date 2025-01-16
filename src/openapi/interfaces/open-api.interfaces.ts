export const OpenApiBidsItemField = {
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

export const OpenApiHrcsItemField = {
  bfSpecRgstNo: '사전규격등록번호',
  bsnsDivNm: '업무구분명',
  prdctClsfcNoNm: '품명',
  rlDminsttNm: '실수요기관명',
  rgstDt: '배정예산금액',
  asignBdgtAmt: '등록일시',
  opninRgstClseDt: '의견등록마감일시',
} as const;

export interface OpenApiEndPoint {
  name: string;
  path: string;
}

export interface OpenApiBidsItem extends Readonly<Record<keyof typeof OpenApiBidsItemField, string>> {
  id: number;
  type: string;
  endPoint: OpenApiEndPoint;
}

export interface OpenApiHrcsItem extends Readonly<Record<keyof typeof OpenApiHrcsItemField, string>> {
  id: number;
  type: string;
  endPoint: OpenApiEndPoint;
}

export interface OpenApiResponseBody<T = OpenApiBidsItem | OpenApiHrcsItem> {
  pageNo: number;
  numOfRows: number;
  totalCount: number;
  items: T[];
}

export interface OpenApiResponse<T = OpenApiBidsItem | OpenApiHrcsItem> {
  body: OpenApiResponseBody<T>;
}

export interface OpenApiFilterRegExp {
  include: RegExp | null;
  exclude: RegExp | null;
}
