import { EmailVerificationEntity, EmailVerificationType } from '@common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { Repository } from 'typeorm';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailVerificationEntity)
    private readonly emailVerificationRepository: Repository<EmailVerificationEntity>,
  ) {}

  async getEmailExpiresIn(userId: number, type: EmailVerificationType) {
    const emailVerification = await this.emailVerificationRepository.findOneBy({
      user: { id: userId },
      type,
    });

    if (emailVerification === null) {
      return 0;
    }

    return Math.floor(DateTime.fromJSDate(emailVerification.expiresIn).diffNow('seconds').get('seconds'));
  }
}
