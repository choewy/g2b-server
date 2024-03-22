import { EventPublisher } from '@choewy/nestjs-event';
import { EmailVerificationEntity, EmailVerificationType, ExceptionMessage, UserDto, UserEntity } from '@common';
import { ConflictException, HttpException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { DateTime } from 'luxon';
import { VerifyEmailCommand } from 'src/email/commands';
import { MockRepository } from 'test/utils';
import { DataSource, EntityManager } from 'typeorm';

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
        { provide: DataSource, useValue: { transaction: (fn: (em: EntityManager) => Promise<any>) => fn(new EntityManager(null)) } },
        { provide: EventPublisher, useValue: { publish: jest.fn() } },
      ],
    }).compile();
    service = module.get(TestEmailService);
  });

  beforeEach(() => {
    jest.spyOn(service, 'sendEmail').mockClear();
    jest.spyOn(userRepository.from(module), 'update').mockClear();
    jest.spyOn(emailVerificationRepository.from(module), 'insert').mockClear();
    jest.spyOn(emailVerificationRepository.from(module), 'update').mockClear();
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

  describe('createCode', () => {
    it('SignUp 인증코드는 6자리로 생성되어야 한다.', () => {
      expect(service.createCode(EmailVerificationType.Signup).length).toBe(6);
    });

    it('ResetPassword 인증코드는 16자리로 생성되어야 한다.', () => {
      expect(service.createCode(EmailVerificationType.ResetPassword).length).toBe(16);
    });
  });

  describe('isExpired', () => {
    it('만료 잔여 시간이 5분 남아있으면 false를 반환해야 한다.', () => {
      expect(service.isExpired(DateTime.local().plus({ minutes: 5 }).toJSDate())).toBeFalsy();
    });

    it('만료 잔여 시간이 5분 지났으면 true를 반환해야 한다.', () => {
      expect(service.isExpired(DateTime.local().minus({ minutes: 5 }).toJSDate())).toBeTruthy();
    });
  });

  describe('validateEmailVerification', () => {
    it('emailVerification이 null이면 NotFoundException를 던진다.', async () => {
      try {
        service.validateEmailVerification(null);
      } catch (e) {
        const exception = e as HttpException;
        expect(exception).toBeInstanceOf(NotFoundException);
        expect(exception.getStatus()).toBe(404);
        expect(exception.message).toBe(ExceptionMessage.InvalidEmailCode);
      }
    });

    it('emailVerification의 코드가 이미 처리되었다면(verified = true), ConflictException를 던진다.', async () => {
      try {
        service.validateEmailVerification(plainToInstance(EmailVerificationEntity, { verified: true }));
      } catch (e) {
        const exception = e as HttpException;
        expect(exception).toBeInstanceOf(ConflictException);
        expect(exception.getStatus()).toBe(409);
        expect(exception.message).toBe(ExceptionMessage.InvalidEmailCode);
      }
    });

    it('emailVerification의 코드가 만료되었다면, ConflictException를 던진다.', async () => {
      try {
        service.validateEmailVerification(
          plainToInstance(EmailVerificationEntity, { expiresIn: DateTime.local().minus({ seconds: 30 }).toJSDate() }),
        );
      } catch (e) {
        const exception = e as HttpException;
        expect(exception).toBeInstanceOf(ConflictException);
        expect(exception.getStatus()).toBe(409);
        expect(exception.message).toBe(ExceptionMessage.ExpiredEmailCode);
      }
    });
  });

  describe('sendSignUpVerificationEmail', () => {
    it('user가 존재하지 않으면 NotFoundException을 던진다.', async () => {
      jest.spyOn(userRepository.from(module), 'findOneBy').mockResolvedValue(null);

      try {
        await service.sendSignUpVerificationEmail(1);
      } catch (e) {
        const exception = e as HttpException;
        expect(exception).toBeInstanceOf(NotFoundException);
        expect(exception.getStatus()).toBe(404);
        expect(exception.message).toBe(ExceptionMessage.NotFoundAuth);
      }
    });

    it('user가 이미 이메일 인증을 받은 상태라면(verified = true), ConflictException를 던진다.', async () => {
      jest.spyOn(userRepository.from(module), 'findOneBy').mockResolvedValue(plainToInstance(UserEntity, { verified: true }));

      try {
        await service.sendSignUpVerificationEmail(1);
      } catch (e) {
        const exception = e as HttpException;
        expect(exception).toBeInstanceOf(ConflictException);
        expect(exception.getStatus()).toBe(409);
        expect(exception.message).toBe(ExceptionMessage.AlreadyVerifiedEmail);
      }
    });

    it('회원가입 인증 메일 발송에 성공하면 아무것도 반환하지 않는다.', async () => {
      jest.spyOn(userRepository.from(module), 'findOneBy').mockResolvedValue(new UserEntity());
      jest.spyOn(emailVerificationRepository.from(module), 'insert').mockResolvedValue({ raw: {}, identifiers: [], generatedMaps: [] });
      jest.spyOn(service, 'sendEmail').mockResolvedValue();

      expect(await service.sendSignUpVerificationEmail(1)).toBeUndefined();
      expect(jest.spyOn(service, 'sendEmail')).toHaveBeenCalledTimes(1);
      expect(jest.spyOn(emailVerificationRepository.from(module), 'insert')).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendResetPasswordVerificationEmail', () => {
    it('user가 존재하지 않으면 NotFoundException을 던진다.', async () => {
      jest.spyOn(userRepository.from(module), 'existsBy').mockResolvedValue(false);

      try {
        await service.sendResetPasswordVerificationEmail('test@example.com');
      } catch (e) {
        const exception = e as HttpException;
        expect(exception).toBeInstanceOf(NotFoundException);
        expect(exception.getStatus()).toBe(404);
        expect(exception.message).toBe(ExceptionMessage.NotFoundAuth);
      }
    });

    it('비밀번호 재설정 인증 메일 발송에 성공하면 아무것도 반환하지 않는다.', async () => {
      jest.spyOn(userRepository.from(module), 'existsBy').mockResolvedValue(true);
      jest.spyOn(emailVerificationRepository.from(module), 'insert').mockResolvedValue({ raw: {}, identifiers: [], generatedMaps: [] });
      jest.spyOn(service, 'sendEmail').mockResolvedValue();

      expect(await service.sendResetPasswordVerificationEmail('test@example.com')).toBeUndefined();
      expect(jest.spyOn(service, 'sendEmail')).toHaveBeenCalledTimes(1);
      expect(jest.spyOn(emailVerificationRepository.from(module), 'insert')).toHaveBeenCalledTimes(1);
    });
  });

  describe('verifyEmail', () => {
    it('user가 존재하지 않으면 NotFoundException을 던진다.', async () => {
      jest.spyOn(userRepository.from(module), 'findOneBy').mockResolvedValue(null);

      try {
        await service.verifyEmail(1, plainToInstance(VerifyEmailCommand, { code: 'abcdef' }));
      } catch (e) {
        const exception = e as HttpException;
        expect(exception).toBeInstanceOf(NotFoundException);
        expect(exception.getStatus()).toBe(404);
        expect(exception.message).toBe(ExceptionMessage.NotFoundAuth);
      }
    });

    it('이메일 인증 코드가 유효하면 user.verified와 emailVerification.verifed를 true로 변경하고, UserDto를 반환한다.', async () => {
      jest.spyOn(userRepository.from(module), 'findOneBy').mockResolvedValue(new UserEntity());
      jest.spyOn(userRepository.from(module), 'update').mockResolvedValue(null);
      jest.spyOn(emailVerificationRepository.from(module), 'findOneBy').mockResolvedValue(new EmailVerificationEntity());
      jest.spyOn(emailVerificationRepository.from(module), 'update').mockResolvedValue(null);

      const result = await service.verifyEmail(1, plainToInstance(VerifyEmailCommand, { code: 'abcdef' }));

      expect(result).toBeInstanceOf(UserDto);
      expect(jest.spyOn(userRepository.from(module), 'update')).toHaveBeenCalledTimes(1);
      expect(jest.spyOn(emailVerificationRepository.from(module), 'update')).toHaveBeenCalledTimes(1);
    });
  });

  describe('verifyResetPasswordEmail', () => {
    it('', async () => {
      expect(1).toBe(1);
    });
  });
});
