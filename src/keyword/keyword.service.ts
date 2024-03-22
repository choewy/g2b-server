import { ExceptionMessage, KeywordDto, KeywordEntity } from '@common';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SetKeywordCommand } from './commands';
import { GetKeywordsQuery } from './queries';

@Injectable()
export class KeywordService {
  constructor(
    @InjectRepository(KeywordEntity)
    private readonly keywordRepository: Repository<KeywordEntity>,
  ) {}

  async getKeywords(userId: number, query: GetKeywordsQuery) {
    const keywords = await this.keywordRepository.find({
      where: {
        user: { id: userId },
        type: query.type,
      },
    });

    return keywords.map((keyword) => new KeywordDto(keyword));
  }

  async createKeyword(userId: number, command: SetKeywordCommand) {
    const dupliatedKeyword = await this.keywordRepository
      .createQueryBuilder()
      .where('userId = :userId', { userId })
      .andWhere('type = :type', { type: command.type })
      .andWhere('BINARY text = :text', { text: command.text })
      .getExists();

    if (dupliatedKeyword === true) {
      throw new ConflictException(ExceptionMessage.AlreadyExistsKeyword);
    }

    const keyword = new KeywordEntity({
      userId,
      type: command.type,
      text: command.text,
    });

    await this.keywordRepository.insert(keyword);

    return new KeywordDto(keyword);
  }

  async updateKeyword(userId: number, keywordId: number, command: SetKeywordCommand) {
    return;
  }

  async deleteKeyword(userId: number, keywordId: number) {
    return;
  }
}
