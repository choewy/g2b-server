import { Repository } from 'typeorm';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { User } from 'src/user/entities/user.entity';
import { ResetPasswordEmailVerification } from 'src/email/entities/reset-password-email-verification.entity';
import { EmailService } from 'src/email/email.service';
import { SendResetPasswordEmailCommand } from '../implemenets/send-reset-password-email.command';

@CommandHandler(SendResetPasswordEmailCommand)
export class SendResetPasswordEmailCommandHandler implements ICommandHandler<SendResetPasswordEmailCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ResetPasswordEmailVerification)
    private readonly resetPasswordEmailVerificationRepository: Repository<ResetPasswordEmailVerification>,
    private readonly emailService: EmailService,
  ) {}

  async execute(command: SendResetPasswordEmailCommand): Promise<void> {
    const existEmail = await this.userRepository.existsBy({ email: command.email });

    if (existEmail === false) {
      throw new NotFoundException('등록되지 않은 이메일 계정입니다.');
    }

    const resetPasswordEmailVerification = command.toEntity();
    await this.resetPasswordEmailVerificationRepository.insert(resetPasswordEmailVerification);
    await this.emailService.sendResetPasswordEmail(resetPasswordEmailVerification);
  }
}
