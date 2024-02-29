import { plainToInstance } from 'class-transformer';

import { User } from 'src/user/entities/user.entity';

export class VerifySignupEmailCodeCommand {
  constructor(readonly userId: number, readonly code: string) {}

  toEntity(signupEmailVerificationId: number) {
    return plainToInstance(User, {
      id: this.userId,
      verified: true,
      signupEmailVerifications: [
        {
          id: signupEmailVerificationId,
          code: this.code,
          verified: true,
        },
      ],
    });
  }
}
