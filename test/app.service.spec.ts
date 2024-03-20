import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from 'src/app.service';

describe(AppService.name, () => {
  let module: TestingModule;
  let context: AppService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [AppService, ConfigService],
    }).compile();

    context = module.get(AppService);
  });

  it('AppService가 정의되어 있어야 한다.', () => {
    expect(context).toBeDefined();
  });

  describe('getVersion', () => {
    it('버전을 요청하면 { version: string | null }을 반환한다.', async () => {
      expect(Object.hasOwn(context.getVersion(), 'version')).toBeTruthy();
    });
  });
});
