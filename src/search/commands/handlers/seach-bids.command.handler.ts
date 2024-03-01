import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { ConfigFactory } from 'src/config/config.factory';
import { SearchState } from 'src/search/entities/search-state.entity';
import { SearchStateDto } from 'src/search/dto/search-state.dto';
import { SearchStateType } from 'src/search/entities/enums';
import { StartSearchBidsEvent } from 'src/search/events/implements/start-search-bids.event';

import { SearchBidsCommand } from '../implements/search-bids.command';

@CommandHandler(SearchBidsCommand)
export class SearchBidsCommandHandler implements ICommandHandler<SearchBidsCommand> {
  constructor(
    @InjectRepository(SearchState)
    private readonly searchStateRepository: Repository<SearchState>,
    private readonly configFactory: ConfigFactory,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SearchBidsCommand): Promise<SearchStateDto> {
    let searchState = await this.searchStateRepository.findOneBy({
      user: { id: command.userId },
      type: SearchStateType.Bids,
    });

    if (searchState) {
      return new SearchStateDto(searchState);
    }

    searchState = command.toEntity(this.configFactory.processId);

    await this.searchStateRepository.insert(searchState);

    this.eventBus.publish(new StartSearchBidsEvent(command.userId, command.params));

    return new SearchStateDto(searchState);
  }
}
