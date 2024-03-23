import { ExcelDto } from '@common';

export class SendSearchExcelEvent {
  constructor(readonly userId: number, readonly excel: ExcelDto) {}
}
