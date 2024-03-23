import { OpenApiBidsItem, OpenApiEndPoint, OpenApiHrcsItem } from '../interfaces';

export abstract class OpenApiFilteredItem {
  id: number;
  type: string;
  keywords: string;

  constructor(i: number, endPoint: OpenApiEndPoint) {
    this.id = i + 1;
    this.type = endPoint.name;
  }

  setKeywords(keywords: RegExpExecArray) {
    this.keywords = keywords.shift() ?? '';

    return this;
  }
}

export class OpenApiBidsFilteredItem extends OpenApiFilteredItem {
  bidNtceNo: string;
  bidNtceDtlUrl: string;
  bidNtceNm: string;
  ntceInsttNm: string;
  dminsttNm: string;
  cntrctCnclsMthdNm: string;
  presmptPrce: string;
  bidNtceDt: string;
  bidClseDt: string;

  constructor(i: number, item: OpenApiBidsItem) {
    super(i, item.endPoint);

    Object.assign(this, item);
  }
}

export class OpenApiHrcsFilteredItem extends OpenApiFilteredItem {
  bfSpecRgstNo: string;
  bsnsDivNm: string;
  prdctClsfcNoNm: string;
  rlDminsttNm: string;
  rgstDt: string;
  asignBdgtAmt: string;
  opninRgstClseDt: string;

  constructor(i: number, item: OpenApiHrcsItem) {
    super(i, item.endPoint);

    Object.assign(this, item);
  }
}
