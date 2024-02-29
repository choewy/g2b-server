import { Repository } from 'typeorm';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { EmailService } from 'src/email/email.service';
import { SignupEmailVerification } from 'src/email/entities/signup-email-verification.entity';

import { SendVerifyEmailCommand } from '../implemenets/send-verify-email.command';

@CommandHandler(SendVerifyEmailCommand)
export class SendVerifyEmailCommandHandler implements ICommandHandler<SendVerifyEmailCommand> {
  constructor(
    @InjectRepository(SignupEmailVerification)
    private readonly signupEmailVerificationRepository: Repository<SignupEmailVerification>,
    private readonly emailService: EmailService,
  ) {}

  async execute(command: SendVerifyEmailCommand): Promise<void> {
    const signupEmailVerification = command.toEntity();

    await this.signupEmailVerificationRepository.insert(signupEmailVerification);
    await this.emailService.sendVerifyEmail(command.email, signupEmailVerification);
  }
}
