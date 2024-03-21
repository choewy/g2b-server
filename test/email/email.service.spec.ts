import { EmailVerificationEntity, EmailVerificationType } from '@common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { DateTime } from 'luxon';
import { EmailService } from 'src/email/email.service';
import { MockRepository } from 'test/utils';

const emailVerificationRepository = new MockRepository(EmailVerificationEntity);

describe('EmailService', () => {
  let module: TestingModule;
  let service: EmailService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [emailVerificationRepository.createProvider(), EmailService],
    }).compile();
    service = module.get(EmailService);
  });

  it('EmailService가 정의되어 있어야 한다.', () => {
    expect(service).toBeDefined();
  });

  describe('getEmailExpiresIn', () => {
    it('이메일 인증을 진행하지 않은 경우 0을 반환한다.', async () => {
      jest.spyOn(emailVerificationRepository.from(module), 'findOneBy').mockResolvedValue(null);

      const seconds = await service.getEmailExpiresIn(1, EmailVerificationType.Signup);

      expect(seconds === 0).toBeTruthy();
    });

    it('이메일 인증 잔여 시간이 남아있는 경우 양수를 반환한다.', async () => {
      jest.spyOn(emailVerificationRepository.from(module), 'findOneBy').mockResolvedValue(
        plainToInstance(EmailVerificationEntity, {
          expiresIn: DateTime.local().plus({ minutes: 15 }).toJSDate(),
        }),
      );

      const seconds = await service.getEmailExpiresIn(1, EmailVerificationType.Signup);

      expect(seconds > 0).toBeTruthy();
    });

    it('이메일 인증 잔여 시간이 만려된 경우 음수를 반환한다.', async () => {
      jest.spyOn(emailVerificationRepository.from(module), 'findOneBy').mockResolvedValue(
        plainToInstance(EmailVerificationEntity, {
          expiresIn: DateTime.local().minus({ minutes: 15 }).toJSDate(),
        }),
      );

      const seconds = await service.getEmailExpiresIn(1, EmailVerificationType.Signup);

      expect(seconds < 0).toBeTruthy();
    });
  });
});
