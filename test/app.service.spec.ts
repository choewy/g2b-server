import fs from 'fs';

import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from 'src/app.service';

describe(AppService.name, () => {
  let module: TestingModule;
  let service: AppService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [AppService, ConfigService],
    }).compile();

    service = module.get(AppService);
  });

  beforeEach(() => {
    jest.spyOn(fs, 'existsSync').mockClear();
    jest.spyOn(fs, 'readFileSync').mockClear();
    jest.spyOn(JSON, 'parse').mockClear();
  });

  it('AppService가 정의되어 있어야 한다.', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('package.json 파일이 없으면 즉시 Return한다.', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);

      service.onModuleInit();
      expect(jest.spyOn(fs, 'readFileSync')).toHaveBeenCalledTimes(0);
      expect(jest.spyOn(JSON, 'parse')).toHaveBeenCalledTimes(0);
    });

    it('package.json 파일이 있으면 package.json 파일에서 version 정보를 가져온다.', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ version: '0.0.0' }));

      service.onModuleInit();
      expect(jest.spyOn(fs, 'readFileSync')).toHaveBeenCalledTimes(1);
      expect(jest.spyOn(JSON, 'parse')).toHaveBeenCalledTimes(1);
    });
  });

  describe('getVersion', () => {
    it('버전을 요청하면 { version: string | null }을 반환한다.', async () => {
      expect(Object.hasOwn(service.getVersion(), 'version')).toBeTruthy();
    });
  });
});
