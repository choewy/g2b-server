import { SearchEntity } from '@common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MockRepository } from 'test/utils';

import { TestSearchService } from './search.service';

const searchRepository = new MockRepository(SearchEntity);

describe('ServiceService', () => {
  let module: TestingModule;
  let service: TestSearchService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [TestSearchService, searchRepository.createProvider(), ConfigService],
    }).compile();

    service = module.get(TestSearchService);
  });

  it('SearchService가 정의되어 있어야 한다.', () => {
    expect(service).toBeDefined();
  });
});
