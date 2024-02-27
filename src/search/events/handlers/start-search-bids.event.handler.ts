import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

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
  ) {}

  async handle(event: StartSearchBidsEvent): Promise<void> {
    try {
      const { types, startDate, endDate } = event.params;

      const items = await this.bidsService.getItemsManyTimes(types, startDate, endDate);
      const filteredItems = await this.searchService.filterBidsItems(event.userId, items);

      this.searchGateway.sendComplete(event.searchId, filteredItems);
    } catch (e) {
      this.searchGateway.sendFail(event.searchId, e);
    }

    await this.searchStateRepository.delete(event.searchId);
  }
}
