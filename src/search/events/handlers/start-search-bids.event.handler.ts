import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { LoggingService } from 'src/logging/logging.service';
import { SearchState } from 'src/search/entities/search-state.entity';
import { SearchService } from 'src/search/search.service';
import { SearchGateway } from 'src/search/search.gateway';
import { BidsService } from 'src/bids/bids.service';

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
  ) {}

  async handle(event: StartSearchBidsEvent): Promise<void> {
    const { userId, searchId, params } = event;

    const logging = this.loggingService.create(StartSearchBidsEvent.name);

    try {
      const { types, startDate, endDate } = params;

      const items = await this.bidsService.getItemsManyTimes(types, startDate, endDate);
      const filteredItems = await this.searchService.filterBidsItems(userId, items);

      this.searchGateway.sendComplete(searchId, '');

      logging.debug('end', {
        userId,
        searchId,
        params,
        parsedItemCount: items.length,
        filteredItemCount: filteredItems.length,
        latency: logging.ms,
      });
    } catch (e) {
      this.searchGateway.sendFail(searchId, e);

      logging.error('error', { userId, searchId, params, ms: logging.ms }, e);
    }

    await this.searchStateRepository.delete(searchId);
  }
}
