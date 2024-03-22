import { ExceptionMessage, KeywordDto, KeywordEntity, KeywordType } from '@common';
import { ConflictException, HttpException, NotFoundException } from '@nestjs/common';
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

  describe('updateKeyword', () => {
    it('키워드가 존재하지 않으면 NotFoundException을 던진다.', async () => {
      jest.spyOn(keywordRepository.from(module), 'findOneBy').mockResolvedValue(null);

      try {
        await service.updateKeyword(1, 1, plainToInstance(SetKeywordCommand, { type: KeywordType.Include, text: 'keyword' }));
      } catch (e) {
        const exception = e as HttpException;
        expect(exception).toBeInstanceOf(NotFoundException);
        expect(exception.getStatus()).toBe(404);
        expect(exception.message).toBe(ExceptionMessage.NotFoundKeyword);
      }
    });

    it('키워드가 존재하나, 변경하려는 키워드의 텍스트가 이미 존재하면 ConflictException을 던진다.', async () => {
      jest.spyOn(keywordRepository.from(module), 'findOneBy').mockResolvedValue(new KeywordEntity());
      jest.spyOn(keywordRepository.from(module).createQueryBuilder(), 'getExists').mockResolvedValue(true);

      try {
        await service.updateKeyword(1, 1, plainToInstance(SetKeywordCommand, { type: KeywordType.Include, text: 'keyword' }));
      } catch (e) {
        const exception = e as HttpException;
        expect(exception).toBeInstanceOf(ConflictException);
        expect(exception.getStatus()).toBe(409);
        expect(exception.message).toBe(ExceptionMessage.AlreadyExistsKeyword);
      }
    });

    it('키워드 수정이 완료되면 KeywordDto를 반환한다.', async () => {
      jest.spyOn(keywordRepository.from(module), 'findOneBy').mockResolvedValue(new KeywordEntity());
      jest.spyOn(keywordRepository.from(module), 'update').mockResolvedValue(null);
      jest.spyOn(keywordRepository.from(module).createQueryBuilder(), 'getExists').mockResolvedValue(false);

      const result = await service.updateKeyword(1, 1, plainToInstance(SetKeywordCommand, { type: KeywordType.Include, text: 'keyword' }));

      expect(result).toBeInstanceOf(KeywordDto);
      expect(jest.spyOn(keywordRepository.from(module), 'update')).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteKeyword', () => {
    it('키워드가 존재하지 않으면 NotFoundException을 던진다.', async () => {
      jest.spyOn(keywordRepository.from(module), 'findOneBy').mockResolvedValue(null);

      try {
        await service.deleteKeyword(1, 1);
      } catch (e) {
        const exception = e as HttpException;
        expect(exception).toBeInstanceOf(NotFoundException);
        expect(exception.getStatus()).toBe(404);
        expect(exception.message).toBe(ExceptionMessage.NotFoundKeyword);
      }
    });

    it('키워드 삭제가 완료되면 KeywordDto를 반환한다.', async () => {
      jest.spyOn(keywordRepository.from(module), 'findOneBy').mockResolvedValue(new KeywordEntity());
      jest.spyOn(keywordRepository.from(module), 'delete').mockResolvedValue(null);

      const result = await service.deleteKeyword(1, 1);

      expect(result).toBeInstanceOf(KeywordDto);
      expect(jest.spyOn(keywordRepository.from(module), 'delete')).toHaveBeenCalledTimes(1);
    });
  });
});
