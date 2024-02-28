import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { LoggingService } from 'src/logging/logging.service';
import { SearchState } from 'src/search/entities/search-state.entity';
import { SearchService } from 'src/search/search.service';
import { SearchGateway } from 'src/search/search.gateway';
import { HrcsService } from 'src/hrcs/hrcs.service';

import { StartSearchHrcsEvent } from '../implements/start-search-hrcs.event';

@EventsHandler(StartSearchHrcsEvent)
export class StartSearchHrcsEventHandler implements IEventHandler<StartSearchHrcsEvent> {
  constructor(
    @InjectRepository(SearchState)
    private readonly searchStateRepository: Repository<SearchState>,
    private readonly searchService: SearchService,
    private readonly searchGateway: SearchGateway,
    private readonly hrcsService: HrcsService,
    private readonly loggingService: LoggingService,
  ) {}

  async handle(event: StartSearchHrcsEvent): Promise<void> {
    const { userId, searchId, params } = event;

    const logging = this.loggingService.create(StartSearchHrcsEvent.name);

    try {
      const { types, startDate, endDate } = params;

      const items = await this.hrcsService.getItemsManyTimes(types, startDate, endDate);
      const filteredItems = await this.searchService.filterHrcsItems(userId, items);

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
