import { Repository } from 'typeorm';

import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { LoggingService } from 'src/logging/logging.service';
import { EmailService } from 'src/email/email.service';
import { SignupEmailVerification } from 'src/email/entities/signup-email-verification.entity';

import { SendSignupEmailEvent } from '../implemenets/send-signup-email.event';

@EventsHandler(SendSignupEmailEvent)
export class SendSignupEmailEventHandler implements IEventHandler<SendSignupEmailEvent> {
  constructor(
    @InjectRepository(SignupEmailVerification)
    private readonly signupEmailVerificationRepository: Repository<SignupEmailVerification>,
    private readonly emailService: EmailService,
    private readonly loggingService: LoggingService,
  ) {}

  async handle(event: SendSignupEmailEvent): Promise<void> {
    const logger = this.loggingService.create(SendSignupEmailEvent.name);

    try {
      const signupEmailVerification = event.toEntity();

      await this.signupEmailVerificationRepository.insert(signupEmailVerification);
      await this.emailService.sendSignupEmail(event.email, signupEmailVerification);

      logger.debug('complete', { userId: event.userId, email: event.email, code: signupEmailVerification.code });
    } catch (e) {
      logger.error('failed', { userId: event.userId, email: event.email }, e);
    }
  }
}
