import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetSearchStateQuery } from '../implements/get-search-state.query';

import { SearchState } from 'src/search/entities/search-state.entity';
import { SearchStateDto } from 'src/search/dto/search-state.dto';

@QueryHandler(GetSearchStateQuery)
export class GetSearchStateQueryHandler implements IQueryHandler<GetSearchStateQuery> {
  constructor(
    @InjectRepository(SearchState)
    private readonly searchStateRepository: Repository<SearchState>,
  ) {}

  async execute(query: GetSearchStateQuery): Promise<SearchStateDto | null> {
    const searchState = await this.searchStateRepository.findOneBy({
      user: { id: query.userId },
      type: query.type,
    });

    return searchState ? new SearchStateDto(searchState) : null;
  }
}
