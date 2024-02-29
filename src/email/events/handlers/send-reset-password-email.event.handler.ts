import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { EmailService } from 'src/email/email.service';
import { LoggingService } from 'src/logging/logging.service';

import { SendResetPasswordEmailEvent } from '../implemenets/send-reset-password-email.event';

@EventsHandler(SendResetPasswordEmailEvent)
export class SendResetPasswordEmailEventHandler implements IEventHandler<SendResetPasswordEmailEvent> {
  constructor(private readonly emailService: EmailService, private readonly loggingService: LoggingService) {}

  async handle(event: SendResetPasswordEmailEvent): Promise<void> {
    const logger = this.loggingService.create(SendResetPasswordEmailEvent.name);

    try {
      await this.emailService.sendResetPasswordEmail(event.email, event.tempPassword);

      logger.debug('completed', { email: event.email });
    } catch (e) {
      logger.error('failed', { email: event.email }, e);
    }
  }
}
