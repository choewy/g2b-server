import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Keyword } from 'src/keyword/entities/keyword.entity';
import { BidsModule } from 'src/bids/bids.module';

import { SearchController } from './search.controller';
import { SearchState } from './entities/search-state.entity';
import { SearchGateway } from './search.gateway';
import { SearchService } from './search.service';
import { SearchBidsCommandHandler } from './commands/handlers/seach-bids.command.handler';
import { StartSearchBidsEventHandler } from './events/handlers/start-search-bids.event.handler';
import { GetSearchStateQueryHandler } from './queries/handlers/get-search-state.query.handler';

const CommandHandlers = [SearchBidsCommandHandler];
const QueryHandlers = [GetSearchStateQueryHandler];
const EventHandlers = [StartSearchBidsEventHandler];

@Module({
  imports: [TypeOrmModule.forFeature([SearchState, Keyword]), BidsModule],
  controllers: [SearchController],
  providers: [SearchGateway, SearchService, ...CommandHandlers, ...QueryHandlers, ...EventHandlers],
})
export class SearchModule {}
