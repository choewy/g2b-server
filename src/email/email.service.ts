import { Transporter, createTransport } from 'nodemailer';

import { Injectable } from '@nestjs/common';

import { ConfigFactory } from 'src/config/config.factory';
import { SignupEmailVerification } from './entities/signup-email-verification.entity';

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

  async sendSignupEmail(email: string, signupEmailVerification: SignupEmailVerification): Promise<void> {
    const title = '[G2B] 회원가입을 축하드립니다.';
    const contnets = [
      '안녕하세요. G2B 개발자입니다.',
      '정상적인 서비스 이용을 위해 아래 인증 코드를 입력해주세요.',
      `인증코드 : ${signupEmailVerification.code}`,
      '감사합니다.',
      'G2B 개발자 드림.',
    ].join('\n\n');

    return this.sendEmail(email, title, contnets);
  }
}
