import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { BidsItem } from 'src/bids/interfaces';
import { Keyword } from 'src/keyword/entities/keyword.entity';

import { FilteredBidsItemDto } from './dto/filtered-bid-item.dto';
import { KeywordType } from 'src/keyword/entities/enums';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
  ) {}

  private async createKeywordRegExpMap(userId: number) {
    const keywords = await this.keywordRepository.findBy({ user: { id: userId } });
    const includeKeywords = keywords.filter(({ type }) => type === KeywordType.Include).map(({ text }) => text);
    const excludeKeywords = keywords.filter(({ type }) => type === KeywordType.Exclude).map(({ text }) => text);
    const includeKeywordRegExp = includeKeywords.length > 0 ? new RegExp(includeKeywords.join('|')) : null;
    const excludeKeywordRegExp = excludeKeywords.length > 0 ? new RegExp(excludeKeywords.join('|')) : null;

    return { include: includeKeywordRegExp, exclude: excludeKeywordRegExp };
  }

  async filterBidsItems(userId: number, items: BidsItem[]): Promise<FilteredBidsItemDto[]> {
    const regExp = await this.createKeywordRegExpMap(userId);

    const filteredItems: FilteredBidsItemDto[] = [];

    while (items.length > 0) {
      const item = new FilteredBidsItemDto(filteredItems.length, items.shift());

      if (regExp.include) {
        const keywords = regExp.include.exec(item.bidNtceNm);

        if (keywords.length === 0) {
          continue;
        }

        item.setKeywords(keywords);
      }

      if (regExp.exclude) {
        const keywords = []
          .concat(regExp.exclude.exec(item.bidNtceNm))
          .concat(regExp.exclude.exec(item.ntceInsttNm))
          .concat(regExp.exclude.exec(item.dminsttNm));

        if (keywords.length > 0) {
          continue;
        }
      }

      filteredItems.push(item);
    }

    return filteredItems;
  }

  async filterHrcsItems(userId: number, items: unknown[]) {
    const regExp = await this.createKeywordRegExpMap(userId);

    const filteredItems: FilteredBidsItemDto[] = [];

    return filteredItems;
  }
}
