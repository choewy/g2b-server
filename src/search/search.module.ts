import { Repository } from 'typeorm';

import { Module, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';

import { ConfigFactory } from 'src/config/config.factory';
import { Keyword } from 'src/keyword/entities/keyword.entity';
import { BidsModule } from 'src/bids/bids.module';
import { HrcsModule } from 'src/hrcs/hrcs.module';

import { SearchController } from './search.controller';
import { SearchState } from './entities/search-state.entity';
import { SearchGateway } from './search.gateway';
import { SearchService } from './search.service';
import { GetSearchStateQueryHandler } from './queries/handlers/get-search-state.query.handler';
import { SearchBidsCommandHandler } from './commands/handlers/seach-bids.command.handler';
import { StartSearchBidsEventHandler } from './events/handlers/start-search-bids.event.handler';
import { SearchHrcsCommandHandler } from './commands/handlers/seach-hrcs.command.handler';
import { StartSearchHrcsEventHandler } from './events/handlers/start-search-hrcs.event.handler';

const QueryHandlers = [GetSearchStateQueryHandler];
const CommandHandlers = [SearchBidsCommandHandler, SearchHrcsCommandHandler];
const EventHandlers = [StartSearchBidsEventHandler, StartSearchHrcsEventHandler];

@Module({
  imports: [TypeOrmModule.forFeature([SearchState, Keyword]), BidsModule, HrcsModule],
  controllers: [SearchController],
  providers: [SearchGateway, SearchService, ...QueryHandlers, ...CommandHandlers, ...EventHandlers],
})
export class SearchModule implements OnModuleDestroy {
  constructor(
    @InjectRepository(SearchState)
    private readonly searchStateRepository: Repository<SearchState>,
    private readonly configFactory: ConfigFactory,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.searchStateRepository.delete({
      processId: this.configFactory.processId,
    });
  }
}
