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

  async getSearch(userId: number, query: GetSearchQuery) {
    const search = await this.searchRepository.findOneBy({
      user: { id: userId },
      type: query.type,
    });

    return search === null ? null : new SearchDto(search);
  }
}
