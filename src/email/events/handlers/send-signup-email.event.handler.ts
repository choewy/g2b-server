import { Repository } from 'typeorm';

import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { LoggingService } from 'src/logging/logging.service';
import { SignupEmailVerification } from 'src/email/entities/signup-email-verification.entity';

import { SendSignupEmailEvent } from '../implemenets/send-signup-email.event';
import { EmailService } from 'src/email/email.service';

@EventsHandler(SendSignupEmailEvent)
export class SendSignupEmailEventHandler implements IEventHandler<SendSignupEmailEvent> {
  constructor(
    @InjectRepository(SignupEmailVerification)
    private readonly signupEmailVerificationRepository: Repository<SignupEmailVerification>,
    private readonly loggingService: LoggingService,
    private readonly emailService: EmailService,
  ) {}

  async handle(event: SendSignupEmailEvent): Promise<void> {
    const logger = this.loggingService.create(SendSignupEmailEvent.name);

    try {
      const emailVerification = event.toEntity();
      await this.signupEmailVerificationRepository.insert(emailVerification);
      await this.emailService.sendVerifyEmail(event.email, emailVerification.code);

      logger.debug('complete', { userId: event.userId, email: event.email, code: emailVerification.code });
    } catch (e) {
      logger.error('failed', { userId: event.userId, email: event.email }, e);
    }
  }
}
