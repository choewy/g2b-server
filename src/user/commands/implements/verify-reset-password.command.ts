import { hashSync } from 'bcrypt';
import { DeepPartial } from 'typeorm';
import { Response } from 'express';
import { plainToInstance } from 'class-transformer';

import { User } from 'src/user/entities/user.entity';
import { VerifyResetPasswordDto } from 'src/user/dto/verify-and-change-password.dto';
import { ResetPasswordEmailVerification } from 'src/email/entities/reset-password-email-verification.entity';

export class VerifyResetPasswordCommand {
  constructor(readonly res: Response, readonly body: VerifyResetPasswordDto) {}

  toEntity(user: User, emailVerification: ResetPasswordEmailVerification): User {
    return plainToInstance(User, {
      id: user.id,
      password: hashSync(this.body.newPassword, 10),
      resetPasswordEmailVerification: [
        {
          id: emailVerification.id,
          used: true,
        },
      ],
    } as DeepPartial<User>);
  }
}
