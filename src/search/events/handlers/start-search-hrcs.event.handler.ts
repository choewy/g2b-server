import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { LoggingService } from 'src/logging/logging.service';
import { SearchService } from 'src/search/search.service';
import { SearchGateway } from 'src/search/search.gateway';
import { HrcsService } from 'src/hrcs/hrcs.service';
import { SearchStateType } from 'src/search/entities/enums';
import { UploadSearchExcelFileEvent } from 'src/file/events/implements/upload-search-excel-file.event';

import { StartSearchHrcsEvent } from '../implements/start-search-hrcs.event';
import { EndSearchEvent } from '../implements/end-search.event';

@EventsHandler(StartSearchHrcsEvent)
export class StartSearchHrcsEventHandler implements IEventHandler<StartSearchHrcsEvent> {
  constructor(
    private readonly searchService: SearchService,
    private readonly searchGateway: SearchGateway,
    private readonly hrcsService: HrcsService,
    private readonly loggingService: LoggingService,
    private readonly eventBus: EventBus,
  ) {}

  async handle(event: StartSearchHrcsEvent): Promise<void> {
    const type = SearchStateType.Hrcs;
    const { userId, params } = event;

    const logging = this.loggingService.create(StartSearchHrcsEvent.name);

    try {
      const { types, startDate, endDate } = params;

      const parseditems = await this.hrcsService.getItemsManyTimes(types, startDate, endDate);
      const parsedItemCount = parseditems.length;
      const filteredItems = await this.searchService.filterHrcsItems(userId, parseditems);
      const filteredItemCount = filteredItems.length;

      this.searchGateway.sendCount(userId, type, filteredItemCount);

      if (filteredItemCount > 0) {
        const buffer = await this.searchService.createHrcsExcelBuffer(filteredItems);
        const filename = `사전규격_${params.startDate}_to_${params.endDate}.xlsx`;

        this.eventBus.publish(new UploadSearchExcelFileEvent(userId, type, buffer, filename));
      } else {
        this.eventBus.publish(new EndSearchEvent(userId, type));
      }

      logging.debug('end', {
        userId,
        params,
        parsedItemCount,
        filteredItemCount,
        latency: logging.ms,
      });
    } catch (e) {
      this.eventBus.publish(new EndSearchEvent(userId, type, e));

      logging.error('error', { userId, params, ms: logging.ms }, e);
    }
  }
}
