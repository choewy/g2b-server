import { Repository } from 'typeorm';

import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { SearchGateway } from 'src/search/search.gateway';
import { SearchState } from 'src/search/entities/search-state.entity';

import { EndSearchEvent } from '../implements/end-search.event';
import { LoggingService } from 'src/logging/logging.service';

@EventsHandler(EndSearchEvent)
export class EndSearchEventHandler implements IEventHandler<EndSearchEvent> {
  constructor(
    @InjectRepository(SearchState)
    private readonly searchStateRepository: Repository<SearchState>,
    private readonly searchGateway: SearchGateway,
    private readonly loggingService: LoggingService,
  ) {}

  async handle(event: EndSearchEvent): Promise<void> {
    const logger = this.loggingService.create(EndSearchEvent.name);

    await this.searchStateRepository.delete({
      user: { id: event.userId },
      type: event.type,
    });

    this.searchGateway.sendEnd(event.userId, event.type, event.error);

    logger.debug('completed', { event });
  }
}
