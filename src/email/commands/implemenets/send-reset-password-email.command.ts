import { v4 } from 'uuid';
import { DateTime } from 'luxon';
import { plainToInstance } from 'class-transformer';

import { ResetPasswordEmailVerification } from 'src/email/entities/reset-password-email-verification.entity';

export class SendResetPasswordEmailCommand {
  constructor(readonly email: string) {}

  toEntity(): ResetPasswordEmailVerification {
    return plainToInstance(ResetPasswordEmailVerification, {
      email: this.email,
      tempPassword: v4().substring(0, 16),
      expiresIn: DateTime.local().plus({ minutes: 5 }).toJSDate(),
    });
  }
}
