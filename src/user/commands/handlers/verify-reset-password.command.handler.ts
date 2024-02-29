import { DateTime } from 'luxon';
import { Repository } from 'typeorm';

import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { JwtService } from 'src/jwt/jwt.service';
import { ResetPasswordEmailVerification } from 'src/email/entities/reset-password-email-verification.entity';
import { User } from 'src/user/entities/user.entity';
import { UserDto } from 'src/user/dto/user.dto';

import { VerifyResetPasswordCommand } from '../implements/verify-reset-password.command';

@CommandHandler(VerifyResetPasswordCommand)
export class VerifyResetPasswordCommandHandler implements ICommandHandler<VerifyResetPasswordCommand> {
  constructor(
    @InjectRepository(ResetPasswordEmailVerification)
    private readonly resetPasswordEmailVerificationRepository: Repository<ResetPasswordEmailVerification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: VerifyResetPasswordCommand): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ email: command.body.email });

    if (user == null) {
      throw new NotFoundException('등록되지 않은 이메일 계정입니다.');
    }

    const emailVerification = await this.resetPasswordEmailVerificationRepository.findOneBy({
      email: command.body.email,
      tempPassword: command.body.tempPassword,
    });

    if (emailVerification == null) {
      throw new BadRequestException('임시 비밀번호가 일치하지 않습니다.');
    }

    if (emailVerification.used) {
      throw new ConflictException('이미 사용된 임시 비밀번호입니다.');
    }

    if (DateTime.fromJSDate(emailVerification.expiresIn).diffNow('minutes').get('minutes') < 0) {
      throw new ConflictException('임시 비밀번호가 만료되었습니다.');
    }

    if (command.body.newPassword !== command.body.confirmPassword) {
      throw new BadRequestException('비밀번호가 같지 않습니다.');
    }

    await this.userRepository.save(command.toEntity(user, emailVerification));

    this.jwtService.setAccessToken(command.res, user.id, user.email);
    this.jwtService.setRefreshToken(command.res, user.id, user.email);

    return new UserDto(user);
  }
}
