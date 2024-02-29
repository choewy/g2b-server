import { Repository } from 'typeorm';

import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { SignupEmailVerification } from 'src/email/entities/signup-email-verification.entity';

import { SendVerifyEmailCommand } from '../implemenets/send-verify-email.command';
import { SendVerifyEmailEvent } from 'src/email/events/implemenets/send-verify-email.event';

@CommandHandler(SendVerifyEmailCommand)
export class SendVerifyEmailCommandHandler implements ICommandHandler<SendVerifyEmailCommand> {
  constructor(
    @InjectRepository(SignupEmailVerification)
    private readonly signupEmailVerificationRepository: Repository<SignupEmailVerification>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SendVerifyEmailCommand): Promise<void> {
    const emailVerification = command.toEntity();
    await this.signupEmailVerificationRepository.insert(emailVerification);

    this.eventBus.publish(new SendVerifyEmailEvent(command.email, emailVerification.code));
  }
}
