import { OnEvent } from '@choewy/nestjs-event';
import { Injectable } from '@nestjs/common';

import { EmailService } from './email.service';
import { SendSignUpEmailEvent } from './events';

@Injectable()
export class EmailEventHandler {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(SendSignUpEmailEvent)
  async handleSendSignUpEvent(event: SendSignUpEmailEvent) {
    return this.emailService.sendSignUpVerificationEmail(event.userId);
  }
}
