import { SearchEntity } from '@common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SearchEventHandler } from './search-event.handler';
import { SearchController } from './search.controller';
import { SearchGateway } from './search.gateway';
import { SearchService } from './search.service';

@Module({
  imports: [TypeOrmModule.forFeature([SearchEntity])],
  controllers: [SearchController],
  providers: [SearchService, SearchGateway, SearchEventHandler],
})
export class SearchModule {}
