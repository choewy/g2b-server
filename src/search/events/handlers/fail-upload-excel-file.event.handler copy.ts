import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { FailUploadSearchExcelFileEvent } from 'src/file/events/implements/fail-upload-search-excel-file.event';
import { SearchGateway } from 'src/search/search.gateway';

@EventsHandler(FailUploadSearchExcelFileEvent)
export class FailUploadSearchExcelFileEventHandler implements IEventHandler<FailUploadSearchExcelFileEvent> {
  constructor(private readonly searchGateway: SearchGateway) {}

  async handle(event: FailUploadSearchExcelFileEvent) {
    this.searchGateway.sendFail(event.searchId, event.error);
  }
}
