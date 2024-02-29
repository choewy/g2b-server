import { Repository } from 'typeorm';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { EmailService } from 'src/email/email.service';
import { SignupEmailVerification } from 'src/email/entities/signup-email-verification.entity';

import { SendSignupEmailCommand } from '../implemenets/send-signup-email.command';

@CommandHandler(SendSignupEmailCommand)
export class SendSignupEmailCommandHandler implements ICommandHandler<SendSignupEmailCommand> {
  constructor(
    @InjectRepository(SignupEmailVerification)
    private readonly signupEmailVerificationRepository: Repository<SignupEmailVerification>,
    private readonly emailService: EmailService,
  ) {}

  async execute(command: SendSignupEmailCommand): Promise<void> {
    const signupEmailVerification = command.toEntity();

    await this.signupEmailVerificationRepository.insert(signupEmailVerification);
    await this.emailService.sendSignupEmail(command.email, signupEmailVerification);
  }
}
