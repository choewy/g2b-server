import { SearchDto, SearchEntity } from '@common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetSearchQuery } from './queries';

@Injectable()
export class SearchService {
  constructor(
    private readonly configServiec: ConfigService,
    @InjectRepository(SearchEntity)
    private readonly searchRepository: Repository<SearchEntity>,
  ) {}

  async getSearches(userId: number, query: GetSearchQuery) {
    const searches = await this.searchRepository.findBy({
      user: { id: userId },
      type: query.type,
    });

    return searches.map((search) => new SearchDto(search));
  }
}
