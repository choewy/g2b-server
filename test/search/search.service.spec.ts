import { EventPublisher } from '@choewy/nestjs-event';
import { SearchDto, SearchEntity } from '@common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { GetSearchQuery } from 'src/search/queries';
import { MockRepository } from 'test/utils';

import { TestSearchService } from './search.service';

const searchRepository = new MockRepository(SearchEntity);

describe('ServiceService', () => {
  let module: TestingModule;
  let service: TestSearchService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        TestSearchService,
        ConfigService,
        { provide: EventPublisher, useValue: { publish: jest.fn() } },
        searchRepository.createProvider(),
      ],
    }).compile();

    service = module.get(TestSearchService);
  });

  it('SearchService가 정의되어 있어야 한다.', () => {
    expect(service).toBeDefined();
  });

  describe('getSearch', () => {
    it('진행중인 입찰공고 검색이 없는 경우 null을 반환한다.', () => {
      jest.spyOn(searchRepository.from(module), 'findOneBy').mockResolvedValue(null);

      expect(service.getSearch(1, plainToInstance(GetSearchQuery, {}))).resolves.toBeNull();
    });

    it('진행중인 입찰공고 검색이 있는 경우 SeachDto을 반환한다.', () => {
      jest.spyOn(searchRepository.from(module), 'findOneBy').mockResolvedValue(new SearchEntity());

      expect(service.getSearch(1, plainToInstance(GetSearchQuery, {}))).resolves.toBeInstanceOf(SearchDto);
    });
  });

  describe('startBidsSearch', () => {
    it('', () => {
      expect(1).toBe(1);
    });
  });

  describe('startHrcsSearch', () => {
    it('', () => {
      expect(1).toBe(1);
    });
  });
});
