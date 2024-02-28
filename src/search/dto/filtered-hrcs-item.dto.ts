import { HrcsItem } from 'src/hrcs/interfaces';

export class FilteredHrcsItemDto implements Omit<HrcsItem, 'endPoint'> {
  id: number;
  type: string;
  keywords: string;
  bfSpecRgstNo: string;
  bsnsDivNm: string;
  prdctClsfcNoNm: string;
  rlDminsttNm: string;
  rgstDt: string;
  asignBdgtAmt: string;
  opninRgstClseDt: string;

  constructor(i: number, { endPoint, ...item }: HrcsItem) {
    Object.assign(this, item);

    this.id = i + 1;
    this.type = endPoint.name;
  }

  setKeywords(keywords: string[]): void {
    this.keywords = keywords.shift() ?? '';
  }
}
