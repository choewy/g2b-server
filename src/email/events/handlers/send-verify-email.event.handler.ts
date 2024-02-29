import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { LoggingService } from 'src/logging/logging.service';
import { EmailService } from 'src/email/email.service';

import { SendSignupEmailEvent } from '../implemenets/send-signup-email.event';
import { SendVerifyEmailEvent } from '../implemenets/send-verify-email.event';

@EventsHandler(SendVerifyEmailEvent)
export class SendVerifyEmailEventHandler implements IEventHandler<SendVerifyEmailEvent> {
  constructor(private readonly emailService: EmailService, private readonly loggingService: LoggingService) {}

  async handle(event: SendVerifyEmailEvent): Promise<void> {
    const logger = this.loggingService.create(SendSignupEmailEvent.name);

    try {
      await this.emailService.sendVerifyEmail(event.email, event.code);

      logger.debug('completed', { email: event.email, code: event.code });
    } catch (e) {
      logger.error('failed', { email: event.email, code: event.code }, e);
    }
  }
}
