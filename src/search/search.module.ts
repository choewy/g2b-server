import { SearchEntity } from '@common';
import { Module, OnModuleDestroy } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenApiEndDto } from 'src/openapi/dtos';

import { SearchGatewayDownError } from './implements';
import { SearchEventHandler } from './search-event.handler';
import { SearchController } from './search.controller';
import { SearchGateway } from './search.gateway';
import { SearchService } from './search.service';

@Module({
  imports: [TypeOrmModule.forFeature([SearchEntity])],
  controllers: [SearchController],
  providers: [SearchService, SearchGateway, SearchEventHandler],
})
export class SearchModule implements OnModuleDestroy {
  constructor(private readonly searchService: SearchService, private readonly searchGateway: SearchGateway) {}

  async onModuleDestroy() {
    const error = new SearchGatewayDownError();
    const searches = await this.searchService.getSearchesByProcessId();

    if (searches.length > 0) {
      await this.searchService.deleteSearchesByProcessId(error);
    }

    for (const search of searches) {
      const result = new OpenApiEndDto(search.type, error);
      this.searchGateway.sendSearchEnd(search.user.id, result);
    }
  }
}
