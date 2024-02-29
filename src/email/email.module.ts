import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailService } from './email.service';
import { SignupEmailVerification } from './entities/signup-email-verification.entity';
import { SendSignupEmailEventHandler } from './events/handlers/send-signup-email.event.handler';

const CommandHandlers = [];
const EventHandlers = [SendSignupEmailEventHandler];

@Module({
  imports: [TypeOrmModule.forFeature([SignupEmailVerification])],
  providers: [EmailService, ...CommandHandlers, ...EventHandlers],
})
export class EmailModule {}
