import { ExceptionMessage, KeywordDto, KeywordEntity, KeywordType } from '@common';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  protected hasDuplicated(userId: number, type: KeywordType, text: string, id?: number) {
    const queryBuilder = this.keywordRepository
      .createQueryBuilder()
      .where('userId = :userId', { userId })
      .andWhere('type = :type', { type })
      .andWhere('BINARY text = :text', { text });

    if (typeof id === 'number') {
      queryBuilder.andWhere('id != :id', { id });
    }

    return queryBuilder.getExists();
  }

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
    const dupliatedKeyword = await this.hasDuplicated(userId, command.type, command.text);

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
    const keyword = await this.keywordRepository.findOneBy({
      id: keywordId,
      user: { id: userId },
      type: command.type,
    });

    if (keyword === null) {
      throw new NotFoundException(ExceptionMessage.NotFoundKeyword);
    }

    const dupliatedKeyword = await this.hasDuplicated(userId, command.type, command.text, keywordId);

    if (dupliatedKeyword === true) {
      throw new ConflictException(ExceptionMessage.AlreadyExistsKeyword);
    }

    keyword.text = command.text;
    await this.keywordRepository.update(keyword.id, keyword);

    return new KeywordDto(keyword);
  }

  async deleteKeyword(userId: number, keywordId: number) {
    return;
  }
}
