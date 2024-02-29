import { DateTime } from 'luxon';
import { MoreThan, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { SignupEmailVerification } from 'src/email/entities/signup-email-verification.entity';

import { GetVerifyEmailRemainSecondsQuery } from '../events/get-verify-email-remain-seconds.query';

@QueryHandler(GetVerifyEmailRemainSecondsQuery)
export class GetVerifyEmailRemainSecondsQueryHandler implements IQueryHandler<GetVerifyEmailRemainSecondsQuery> {
  constructor(
    @InjectRepository(SignupEmailVerification)
    private readonly signupEmailVerificationRepository: Repository<SignupEmailVerification>,
  ) {}

  async execute(query: GetVerifyEmailRemainSecondsQuery): Promise<number> {
    const emailVerification = await this.signupEmailVerificationRepository.findOneBy({
      user: { id: query.userId },
      expiresIn: MoreThan(new Date()),
      verified: false,
    });

    if (emailVerification == null) {
      return 0;
    } else {
      return Math.floor(DateTime.fromJSDate(emailVerification.expiresIn).diffNow('seconds').get('seconds'));
    }
  }
}
