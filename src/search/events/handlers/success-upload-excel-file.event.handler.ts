import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { SuccessUploadSearchExcelFileEvent } from 'src/file/events/implements/success-upload-search-excel-file.event';
import { SearchGateway } from 'src/search/search.gateway';

@EventsHandler(SuccessUploadSearchExcelFileEvent)
export class SuccessUploadSearchExcelFileEventHandler implements IEventHandler<SuccessUploadSearchExcelFileEvent> {
  constructor(private readonly searchGateway: SearchGateway) {}

  async handle(event: SuccessUploadSearchExcelFileEvent) {
    this.searchGateway.sendExcelFile(event.searchId, event.uploadedExcelFile);
  }
}
