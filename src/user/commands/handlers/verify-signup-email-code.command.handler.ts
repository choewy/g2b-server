import { DateTime } from 'luxon';
import { Repository } from 'typeorm';

import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/user/entities/user.entity';
import { UserDto } from 'src/user/dto/user.dto';
import { SignupEmailVerification } from 'src/email/entities/signup-email-verification.entity';

import { VerifySignupEmailCodeCommand } from '../implements/verify-signup-email-code.command';

@CommandHandler(VerifySignupEmailCodeCommand)
export class VerifySignupEmailCodeCommandHandler implements ICommandHandler<VerifySignupEmailCodeCommand> {
  constructor(
    @InjectRepository(SignupEmailVerification)
    private readonly signupEmailVerificationRepository: Repository<SignupEmailVerification>,
    @InjectRepository(User)
    private readonly userReposiory: Repository<User>,
  ) {}

  async execute(command: VerifySignupEmailCodeCommand): Promise<UserDto> {
    const emailVerification = await this.signupEmailVerificationRepository.findOne({
      relations: { user: true },
      where: {
        user: { id: command.userId },
        code: command.code,
      },
    });

    if (emailVerification === null || DateTime.fromJSDate(emailVerification.expiresIn).diffNow('minutes').get('minutes') < 0) {
      throw new BadRequestException('만료되었거나 유효하지 않은 인증코드입니다.');
    }

    if (emailVerification.verified && emailVerification.user.verified) {
      return new UserDto(emailVerification.user);
    }

    return new UserDto(await this.userReposiory.save(command.toEntity(emailVerification.id)));
  }
}
