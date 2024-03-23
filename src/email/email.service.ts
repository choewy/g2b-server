import { EventPublisher } from '@choewy/nestjs-event';
import { EMAIL_CONFIG, EmailVerificationEntity, EmailVerificationType, ExceptionMessage, UserDto, UserEntity } from '@common';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { DateTime } from 'luxon';
import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SetTokensEvent, UpdatePasswordEvent } from 'src/auth/events';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { v4 } from 'uuid';

import { ResetPasswordCommand, VerifyEmailCommand } from './commands';
import { SendEmailContent } from './interfaces';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly eventPublisher: EventPublisher,
    private readonly dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(EmailVerificationEntity)
    private readonly emailVerificationRepository: Repository<EmailVerificationEntity>,
  ) {}

  async getEmailExpiresIn(userId: number) {
    const emailVerification = await this.emailVerificationRepository.findOneBy({
      user: { id: userId },
      verified: false,
      expiresIn: MoreThan(new Date()),
    });

    if (emailVerification === null) {
      return 0;
    }

    return Math.floor(DateTime.fromJSDate(emailVerification.expiresIn).diffNow('seconds').get('seconds'));
  }

  protected createCode(type: EmailVerificationType) {
    const code = v4().replaceAll('-', '');

    switch (type) {
      case EmailVerificationType.Signup:
        return code.substring(0, 6);

      case EmailVerificationType.ResetPassword:
        return code.substring(0, 16);
    }
  }

  protected createExpieresIn(minutes: number) {
    return DateTime.local().plus({ minutes }).toJSDate();
  }

  protected createSignUpEmailContent(code: string): SendEmailContent {
    return {
      title: '[G2B] 이메일 인증을 완료해주세요.',
      body: [
        '안녕하세요. G2B 개발자입니다.',
        '정상적인 서비스 이용을 위해 아래 인증 코드를 입력해주세요.\n(인증 코드는 5분 후 만료됩니다.)',
        `인증코드 : ${code}`,
        '감사합니다.',
        'G2B 개발자 드림.',
      ].join('\n\n'),
    };
  }

  protected createResetPasswordEmailContent(code: string): SendEmailContent {
    return {
      title: '[G2B] 임시 비밀번호가 발급되었습니다.',
      body: [
        '안녕하세요. G2B 개발자입니다.',
        '발급된 임시 비밀번호를 사용하여 비밀번호를 재설정하세요.\n(임시 비밀번호는 5분 후 만료됩니다.)',
        `임시 비밀번호 : ${code}`,
        '감사합니다.',
        'G2B 개발자 드림.',
      ].join('\n\n'),
    };
  }

  protected async sendEmail(email: string, content: SendEmailContent) {
    const config = this.configService.get<SMTPTransport.Options>(EMAIL_CONFIG);
    const transporter = createTransport(config);

    return new Promise<void>((resolve, reject) => {
      transporter.sendMail(
        {
          to: email,
          subject: content.title,
          text: content.body,
        },
        (error) => (error ? reject(error) : resolve()),
      );
    });
  }

  protected isExpired(expiresIn: Date) {
    return DateTime.fromJSDate(expiresIn).diffNow('seconds').get('seconds') <= 0;
  }

  protected validateEmailVerification(emailVerification: EmailVerificationEntity | null) {
    if (emailVerification === null) {
      throw new NotFoundException(ExceptionMessage.InvalidEmailCode);
    }

    if (emailVerification.verified === true) {
      throw new ConflictException(ExceptionMessage.InvalidEmailCode);
    }

    if (this.isExpired(emailVerification.expiresIn)) {
      throw new ConflictException(ExceptionMessage.ExpiredEmailCode);
    }
  }

  async sendSignUpVerificationEmail(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (user === null) {
      throw new NotFoundException(ExceptionMessage.NotFoundAuth);
    }

    if (user.verified === true) {
      throw new ConflictException(ExceptionMessage.AlreadyVerifiedEmail);
    }

    const type = EmailVerificationType.Signup;
    const code = this.createCode(type);
    const expiresIn = this.createExpieresIn(5);
    const emailVerification = new EmailVerificationEntity({ userId, type, code, expiresIn });
    await this.emailVerificationRepository.insert(emailVerification);

    this.sendEmail(user.email, this.createSignUpEmailContent(code));
  }

  async sendResetPasswordVerificationEmail(email: string) {
    const existsUserByEmail = await this.userRepository.existsBy({ email });

    if (existsUserByEmail === false) {
      throw new NotFoundException(ExceptionMessage.NotFoundAuth);
    }

    const type = EmailVerificationType.ResetPassword;
    const code = this.createCode(type);
    const expiresIn = this.createExpieresIn(5);
    const emailVerification = new EmailVerificationEntity({ email, type, code, expiresIn });
    await this.emailVerificationRepository.insert(emailVerification);

    this.sendEmail(email, this.createResetPasswordEmailContent(code));
  }

  async verifyEmail(userId: number, command: VerifyEmailCommand) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (user === null) {
      throw new NotFoundException(ExceptionMessage.NotFoundAuth);
    }

    const emailVerification = await this.emailVerificationRepository.findOneBy({
      user: { id: userId },
      type: EmailVerificationType.Signup,
      code: command.code,
    });

    this.validateEmailVerification(emailVerification);

    await this.dataSource.transaction(async () => {
      user.verified = true;

      await this.userRepository.update(user.id, user);
      await this.emailVerificationRepository.update(emailVerification.id, { verified: true });
    });

    return new UserDto(user);
  }

  async verifyResetPasswordEmail(res: Response, command: ResetPasswordCommand) {
    const user = await this.userRepository.findOneBy({ email: command.email });

    if (user === null) {
      throw new NotFoundException(ExceptionMessage.NotFoundAuth);
    }

    const emailVerification = await this.emailVerificationRepository.findOneBy({
      email: command.email,
      type: EmailVerificationType.ResetPassword,
      code: command.tempPassword,
    });

    this.validateEmailVerification(emailVerification);

    if (command.newPassword !== command.confirmPassword) {
      throw new BadRequestException(ExceptionMessage.IncorrectPasswords);
    }

    await this.dataSource.transaction(async () => {
      await this.eventPublisher.publish(new UpdatePasswordEvent(user, command.newPassword), { throwError: true });
      await this.emailVerificationRepository.update(emailVerification.id, { verified: true });
    });

    await this.eventPublisher.publish(new SetTokensEvent(res, { id: user.id, email: user.email }));

    return new UserDto(user);
  }
}
