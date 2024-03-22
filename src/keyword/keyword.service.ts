import { KeywordEntity } from '@common';
import { Injectable } from '@nestjs/common';
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
    return;
  }

  async createKeyword(userId: number, command: SetKeywordCommand) {
    return;
  }

  async updateKeyword(userId: number, keywordId: number, command: SetKeywordCommand) {
    return;
  }

  async deleteKeyword(userId: number, keywordId: number) {
    return;
  }
}
