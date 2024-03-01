import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { SearchGateway } from 'src/search/search.gateway';
import { SuccessUploadSearchExcelFileEvent } from '../implements/success-upload-search-excel-file.event';

@EventsHandler(SuccessUploadSearchExcelFileEvent)
export class SuccessUploadSearchExcelFileEventHandler implements IEventHandler<SuccessUploadSearchExcelFileEvent> {
  constructor(private readonly searchGateway: SearchGateway) {}

  async handle(event: SuccessUploadSearchExcelFileEvent) {
    this.searchGateway.sendFile(event.userId, event.uploadedExcelFile);
  }
}
