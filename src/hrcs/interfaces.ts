export const HrcsItemField = {
  bfSpecRgstNo: '사전규격등록번호',
  bsnsDivNm: '업무구분명',
  prdctClsfcNoNm: '품명',
  rlDminsttNm: '실수요기관명',
  rgstDt: '배정예산금액',
  asignBdgtAmt: '등록일시',
  opninRgstClseDt: '의견등록마감일시',
} as const;

export interface HrcsEndPoint {
  name: string;
  path: string;
}

export interface HrcsItem extends Readonly<Record<keyof typeof HrcsItemField, string>> {
  id: number;
  type: string;
  endPoint: HrcsEndPoint;
}

export interface HrcsResponesBody {
  pageNo: number;
  numOfRows: number;
  totalCount: number;
  items: HrcsItem[];
}

export interface HrcsResponse {
  response: { body: HrcsResponesBody };
}
