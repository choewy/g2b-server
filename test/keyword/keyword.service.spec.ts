import { ExceptionMessage, KeywordDto, KeywordEntity, KeywordType } from '@common';
import { ConflictException, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { SetKeywordCommand } from 'src/keyword/commands';
import { MockRepository } from 'test/utils';

import { TestKeywordService } from './keyword.service';

const keywordRepository = new MockRepository(KeywordEntity);
const createQueryBuilder = {
  where: () => createQueryBuilder,
  andWhere: () => createQueryBuilder,
  getExists: () => false,
} as any;

describe('KeywordService', () => {
  let module: TestingModule;
  let service: TestKeywordService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [TestKeywordService, keywordRepository.createProvider()],
    }).compile();

    service = module.get(TestKeywordService);
  });

  beforeEach(() => {
    jest.spyOn(keywordRepository.from(module), 'createQueryBuilder').mockReturnValue(createQueryBuilder);
    jest.spyOn(keywordRepository.from(module).createQueryBuilder(), 'getExists').mockClear();
    jest.spyOn(keywordRepository.from(module), 'insert').mockClear();
    jest.spyOn(keywordRepository.from(module), 'update').mockClear();
    jest.spyOn(keywordRepository.from(module), 'delete').mockClear();
  });

  it('KeywordService가 정의되어 있어야 한다.', () => {
    expect(service).toBeDefined();
  });

  describe('createKeyword', () => {
    it('이미 키워드가 등록되어 있으면 ConflictException을 던진다.', async () => {
      jest.spyOn(keywordRepository.from(module), 'createQueryBuilder').mockReturnValue(createQueryBuilder);
      jest.spyOn(keywordRepository.from(module).createQueryBuilder(), 'getExists').mockResolvedValue(true);

      try {
        await service.createKeyword(1, plainToInstance(SetKeywordCommand, { type: KeywordType.Include, text: 'hello' }));
      } catch (e) {
        const exception = e as HttpException;
        expect(exception).toBeInstanceOf(ConflictException);
        expect(exception.getStatus()).toBe(409);
        expect(exception.message).toBe(ExceptionMessage.AlreadyExistsKeyword);
      }
    });

    it('키워드가 등록되어 있지 않으면 키워드를 저장 후 KeywordDto를 반환한다.', async () => {
      jest.spyOn(keywordRepository.from(module).createQueryBuilder(), 'getExists').mockResolvedValue(false);
      jest.spyOn(keywordRepository.from(module), 'insert').mockResolvedValue(null);

      const result = await service.createKeyword(1, plainToInstance(SetKeywordCommand, { type: KeywordType.Include, text: 'hello' }));

      expect(result).toBeInstanceOf(KeywordDto);
      expect(jest.spyOn(keywordRepository.from(module), 'insert')).toHaveBeenCalledTimes(1);
    });
  });
});
