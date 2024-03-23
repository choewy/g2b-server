import { EventPublisher } from '@choewy/nestjs-event';
import { KeywordEntity } from '@common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MockRepository } from 'test/utils';

import { TestOpenApiService } from './openapi.service';

const keywordRepository = new MockRepository(KeywordEntity);

describe('OpenApiService', () => {
  let module: TestingModule;
  let service: TestOpenApiService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        TestOpenApiService,
        ConfigService,
        keywordRepository.createProvider(),
        { provide: EventPublisher, useValue: { publish: jest.fn() } },
      ],
    }).compile();

    service = module.get(TestOpenApiService);
  });

  it('OpenApiService가 정의되어 있어야 한다.', () => {
    expect(service).toBeDefined();
  });

  beforeEach(() => {
    return;
  });
});
