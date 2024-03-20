import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';

describe(AppController.name, () => {
  let module: TestingModule;
  let context: AppController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, ConfigService],
    }).compile();

    context = module.get(AppController);
  });

  it('AppController가 정의되어 있어야 한다.', () => {
    expect(context).toBeDefined();
  });

  describe('getVersion', () => {
    it('버전을 요청하면 { version: string | null }을 반환한다.', async () => {
      expect(Object.hasOwn(context.getVersion(), 'version')).toBeTruthy();
    });
  });
});
