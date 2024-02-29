import { DateTime } from 'luxon';
import { Repository } from 'typeorm';

import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/user/entities/user.entity';
import { UserDto } from 'src/user/dto/user.dto';

import { VerifySignupEmailCodeCommand } from '../implements/verify-signup-email-code.command';

@CommandHandler(VerifySignupEmailCodeCommand)
export class VerifySignupEmailCodeCommandHandler implements ICommandHandler<VerifySignupEmailCodeCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userReposiory: Repository<User>,
  ) {}

  async execute(command: VerifySignupEmailCodeCommand): Promise<UserDto> {
    const user = await this.userReposiory.findOne({
      relations: { signupEmailVerifications: true },
      where: {
        id: command.userId,
        signupEmailVerifications: { code: command.code },
      },
    });

    if (user.verified) {
      return new UserDto(user);
    }

    const emailVerification = user.signupEmailVerifications[0] ?? null;

    if (emailVerification === null) {
      throw new BadRequestException('잘못된 인증 코드입니다.');
    }

    if (emailVerification.verified) {
      return new UserDto(user);
    }

    if (DateTime.fromJSDate(emailVerification.expiresIn).diffNow('minutes').get('minutes') < 0) {
      throw new BadRequestException('인증 시간이 만료되었습니다.');
    }

    return new UserDto(await this.userReposiory.save(command.toEntity(emailVerification.id)));
  }
}
