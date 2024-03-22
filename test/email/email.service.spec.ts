import { EventPublisher } from '@choewy/nestjs-event';
import { EmailVerificationEntity, UserEntity } from '@common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { DateTime } from 'luxon';
import { MockRepository } from 'test/utils';
import { DataSource } from 'typeorm';

import { TestEmailService } from './email.service';

const userRepository = new MockRepository(UserEntity);
const emailVerificationRepository = new MockRepository(EmailVerificationEntity);

describe('EmailService', () => {
  let module: TestingModule;
  let service: TestEmailService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        TestEmailService,
        userRepository.createProvider(),
        emailVerificationRepository.createProvider(),
        ConfigService,
        JwtService,
        { provide: DataSource, useValue: { transaction: jest.fn() } },
        { provide: EventPublisher, useValue: { publish: jest.fn() } },
      ],
    }).compile();
    service = module.get(TestEmailService);
  });

  it('EmailService가 정의되어 있어야 한다.', () => {
    expect(service).toBeDefined();
  });

  describe('getEmailExpiresIn', () => {
    it('이메일 인증을 진행하지 않은 경우 0을 반환한다.', async () => {
      jest.spyOn(emailVerificationRepository.from(module), 'findOneBy').mockResolvedValue(null);

      const seconds = await service.getEmailExpiresIn(1);

      expect(seconds === 0).toBeTruthy();
    });

    it('이메일 인증 잔여 시간이 남아있는 경우 양수를 반환한다.', async () => {
      jest.spyOn(emailVerificationRepository.from(module), 'findOneBy').mockResolvedValue(
        plainToInstance(EmailVerificationEntity, {
          expiresIn: DateTime.local().plus({ minutes: 15 }).toJSDate(),
        }),
      );

      const seconds = await service.getEmailExpiresIn(1);

      expect(seconds > 0).toBeTruthy();
    });

    it('이메일 인증 잔여 시간이 만려된 경우 음수를 반환한다.', async () => {
      jest.spyOn(emailVerificationRepository.from(module), 'findOneBy').mockResolvedValue(
        plainToInstance(EmailVerificationEntity, {
          expiresIn: DateTime.local().minus({ minutes: 15 }).toJSDate(),
        }),
      );

      const seconds = await service.getEmailExpiresIn(1);

      expect(seconds < 0).toBeTruthy();
    });
  });
});
