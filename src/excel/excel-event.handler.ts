import { OnEvent } from '@choewy/nestjs-event';
import { Injectable } from '@nestjs/common';

import { CreateExcelEvent } from './events';
import { ExcelService } from './excel.service';

@Injectable()
export class ExcelEventHandler {
  constructor(private readonly excelService: ExcelService) {}

  @OnEvent(CreateExcelEvent)
  async handleCreateExcelEvent(event: CreateExcelEvent) {
    return this.excelService.createExcel(event.type, event.filteredItems, event.startDate, event.endDate, event.userId);
  }
}
