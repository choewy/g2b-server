import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { LoggingService } from 'src/logging/logging.service';
import { SearchService } from 'src/search/search.service';
import { SearchGateway } from 'src/search/search.gateway';
import { BidsService } from 'src/bids/bids.service';
import { UploadSearchExcelFileEvent } from 'src/file/events/implements/upload-search-excel-file.event';
import { SearchStateType } from 'src/search/entities/enums';

import { StartSearchBidsEvent } from '../implements/start-search-bids.event';
import { EndSearchEvent } from '../implements/end-search.event';

@EventsHandler(StartSearchBidsEvent)
export class StartSearchBidsEventHandler implements IEventHandler<StartSearchBidsEvent> {
  constructor(
    private readonly searchService: SearchService,
    private readonly searchGateway: SearchGateway,
    private readonly bidsService: BidsService,
    private readonly loggingService: LoggingService,
    private readonly eventBus: EventBus,
  ) {}

  async handle(event: StartSearchBidsEvent): Promise<void> {
    const type = SearchStateType.Bids;
    const { userId, params } = event;

    const logging = this.loggingService.create(StartSearchBidsEvent.name);

    try {
      const { types, startDate, endDate } = params;

      const parseditems = await this.bidsService.getItemsManyTimes(types, startDate, endDate);
      const parsedItemCount = parseditems.length;
      const filteredItems = await this.searchService.filterBidsItems(userId, parseditems);
      const filteredItemCount = filteredItems.length;

      this.searchGateway.sendCount(userId, type, filteredItemCount);

      if (filteredItemCount > 0) {
        const buffer = await this.searchService.createBidsExcelBuffer(filteredItems);
        const filename = `입찰공고_${params.startDate}_to_${params.endDate}.xlsx`;

        this.eventBus.publish(new UploadSearchExcelFileEvent(userId, type, buffer, filename));
      } else {
        this.eventBus.publish(new EndSearchEvent(userId, type));
      }

      logging.debug('completed', {
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
