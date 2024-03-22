import { KeywordEntity } from '@common';
import { Test, TestingModule } from '@nestjs/testing';
import { MockRepository } from 'test/utils';

import { TestKeywordService } from './keyword.service';

const keywordRepository = new MockRepository(KeywordEntity);

describe('KeywordService', () => {
  let module: TestingModule;
  let service: TestKeywordService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [TestKeywordService, keywordRepository.createProvider()],
    }).compile();

    service = module.get(TestKeywordService);
  });

  it('KeywordService가 정의되어 있어야 한다.', () => {
    expect(service).toBeDefined();
  });
});
