import { Repository } from 'typeorm';

import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { SearchGateway } from 'src/search/search.gateway';
import { SearchState } from 'src/search/entities/search-state.entity';

import { EndSearchEvent } from '../implements/end-search.event';

@EventsHandler(EndSearchEvent)
export class EndSearchEventHandler implements IEventHandler<EndSearchEvent> {
  constructor(
    @InjectRepository(SearchState)
    private readonly searchStateRepository: Repository<SearchState>,
    private readonly searchGateway: SearchGateway,
  ) {}

  async handle(event: EndSearchEvent): Promise<void> {
    await this.searchStateRepository.delete({
      user: { id: event.userId },
      type: event.type,
    });

    this.searchGateway.sendEnd(event.userId, event.type, event.error);
  }
}
