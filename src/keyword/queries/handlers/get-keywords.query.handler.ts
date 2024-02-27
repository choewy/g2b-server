import { Repository } from 'typeorm';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Keyword } from 'src/keyword/entities/keyword.entity';
import { KeywordDto } from 'src/keyword/dto/keyword.dto';

import { GetKeywordsQuery } from '../implements/get-keywords.query';

@QueryHandler(GetKeywordsQuery)
export class GetKeywordsQueryHandler implements IQueryHandler<GetKeywordsQuery> {
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
  ) {}

  async execute(query: GetKeywordsQuery): Promise<KeywordDto[]> {
    const keywords = await this.keywordRepository.findBy({
      user: { id: query.userId },
    });

    return keywords.map((keyword) => new KeywordDto(keyword));
  }
}
