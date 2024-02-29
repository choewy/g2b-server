import { Transporter, createTransport } from 'nodemailer';

import { Injectable } from '@nestjs/common';

import { ConfigFactory } from 'src/config/config.factory';

@Injectable()
export class EmailService {
  constructor(private readonly configFactory: ConfigFactory) {}

  private get transporter(): Transporter {
    return createTransport(this.configFactory.emailTransportOptions);
  }

  private async sendEmail(email: string, title: string, contents: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.transporter.sendMail(
        {
          to: email,
          subject: title,
          text: contents,
        },
        (error) => (error ? reject(error) : resolve()),
      );
    });
  }

  async sendVerifyEmail(email: string, code: string): Promise<void> {
    const title = '[G2B] 이메일 인증을 완료해주세요.';
    const contnets = [
      '안녕하세요. G2B 개발자입니다.',
      '정상적인 서비스 이용을 위해 아래 인증 코드를 입력해주세요.\n(인증 코드는 5분 후 만료됩니다.)',
      `인증코드 : ${code}`,
      '감사합니다.',
      'G2B 개발자 드림.',
    ].join('\n\n');

    return this.sendEmail(email, title, contnets);
  }

  async sendResetPasswordEmail(email: string, tempPassword: string): Promise<void> {
    const title = '[G2B] 임시 비밀번호가 발급되었습니다.';
    const contnets = [
      '안녕하세요. G2B 개발자입니다.',
      '발급된 임시 비밀번호를 사용하여 비밀번호를 재설정하세요.\n(임시 비밀번호는 5분 후 만료됩니다.)',
      `임시 비밀번호 : ${tempPassword}`,
      '감사합니다.',
      'G2B 개발자 드림.',
    ].join('\n\n');

    return this.sendEmail(email, title, contnets);
  }
}
