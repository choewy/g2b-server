/* eslint-disable @typescript-eslint/no-unused-vars */

import { EmailVerificationEntity, EmailVerificationType } from '@common';
import { EmailService } from 'src/email/email.service';
import { SendEmailContent } from 'src/email/interfaces';

export class TestEmailService extends EmailService {
  createCode(type: EmailVerificationType): string {
    return super.createCode(type);
  }

  createExpieresIn(minutes: number): Date {
    return super.createExpieresIn(minutes);
  }

  createSignUpEmailContent(code: string): SendEmailContent {
    return {
      title: 'signup',
      body: '',
    };
  }

  createResetPasswordEmailContent(code: string): SendEmailContent {
    return {
      title: 'reset password',
      body: '',
    };
  }

  sendEmail(email: string, content: SendEmailContent): Promise<void> {
    return;
  }

  isExpired(expiresIn: Date): boolean {
    return super.isExpired(expiresIn);
  }

  validateEmailVerification(emailVerification: EmailVerificationEntity): void {
    return super.validateEmailVerification(emailVerification);
  }
}
