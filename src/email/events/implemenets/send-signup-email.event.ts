import { v4 } from 'uuid';
import { DateTime } from 'luxon';
import { plainToInstance } from 'class-transformer';

import { SignupEmailVerification } from 'src/email/entities/signup-email-verification.entity';

export class SendSignupEmailEvent {
  constructor(readonly userId: number, readonly email: string) {}

  toEntity(): SignupEmailVerification {
    return plainToInstance(SignupEmailVerification, {
      user: { id: this.userId },
      code: v4().substring(0, 6),
      expiresIn: DateTime.local().plus({ minutes: 5 }).toJSDate(),
    });
  }
}
