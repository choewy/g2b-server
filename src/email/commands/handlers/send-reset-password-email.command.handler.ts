import { Repository } from 'typeorm';

import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { User } from 'src/user/entities/user.entity';
import { ResetPasswordEmailVerification } from 'src/email/entities/reset-password-email-verification.entity';
import { SendResetPasswordEmailEvent } from 'src/email/events/implemenets/send-reset-password-email.event';

import { SendResetPasswordEmailCommand } from '../implemenets/send-reset-password-email.command';

@CommandHandler(SendResetPasswordEmailCommand)
export class SendResetPasswordEmailCommandHandler implements ICommandHandler<SendResetPasswordEmailCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ResetPasswordEmailVerification)
    private readonly resetPasswordEmailVerificationRepository: Repository<ResetPasswordEmailVerification>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SendResetPasswordEmailCommand): Promise<void> {
    const existEmail = await this.userRepository.existsBy({ email: command.email });

    if (existEmail === false) {
      throw new NotFoundException('등록되지 않은 이메일 계정입니다.');
    }

    const emailVerification = command.toEntity();
    await this.resetPasswordEmailVerificationRepository.insert(emailVerification);

    this.eventBus.publish(new SendResetPasswordEmailEvent(command.email, emailVerification.tempPassword));
  }
}
