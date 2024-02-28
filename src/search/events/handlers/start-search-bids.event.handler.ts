import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { LoggingService } from 'src/logging/logging.service';
import { SearchState } from 'src/search/entities/search-state.entity';
import { SearchService } from 'src/search/search.service';
import { SearchGateway } from 'src/search/search.gateway';
import { BidsService } from 'src/bids/bids.service';
import { UploadSearchExcelFileEvent } from 'src/file/events/implements/upload-search-excel-file.event';
import { UploadedExcelFileType } from 'src/file/entities/enums';

import { StartSearchBidsEvent } from '../implements/start-search-bids.event';

@EventsHandler(StartSearchBidsEvent)
export class StartSearchBidsEventHandler implements IEventHandler<StartSearchBidsEvent> {
  constructor(
    @InjectRepository(SearchState)
    private readonly searchStateRepository: Repository<SearchState>,
    private readonly searchService: SearchService,
    private readonly searchGateway: SearchGateway,
    private readonly bidsService: BidsService,
    private readonly loggingService: LoggingService,
    private readonly eventBus: EventBus,
  ) {}

  async handle(event: StartSearchBidsEvent): Promise<void> {
    const { userId, searchId, params } = event;

    const logging = this.loggingService.create(StartSearchBidsEvent.name);

    try {
      const { types, startDate, endDate } = params;

      const parseditems = await this.bidsService.getItemsManyTimes(types, startDate, endDate);
      const parsedItemCount = parseditems.length;
      const filteredItems = await this.searchService.filterBidsItems(userId, parseditems);
      const filteredItemCount = filteredItems.length;

      this.searchGateway.sendCount(searchId, filteredItemCount);

      if (filteredItemCount > 0) {
        const buffer = await this.searchService.createBidsExcelBuffer(filteredItems);
        const filename = `입찰공고_${params.startDate}_${params.endDate}.xlsx`;

        this.eventBus.publish(new UploadSearchExcelFileEvent(searchId, userId, UploadedExcelFileType.Bids, buffer, filename));
      }

      logging.debug('end', {
        userId,
        searchId,
        params,
        parsedItemCount,
        filteredItemCount,
        latency: logging.ms,
      });
    } catch (e) {
      this.searchGateway.sendFail(searchId, e);

      logging.error('error', { userId, searchId, params, ms: logging.ms }, e);
    }

    await this.searchStateRepository.delete(searchId);
  }
}
