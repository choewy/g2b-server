import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/user/entities/user.entity';

import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { SignupEmailVerification } from './entities/signup-email-verification.entity';
import { SendSignupEmailEventHandler } from './events/handlers/send-signup-email.event.handler';
import { SendVerifyEmailCommandHandler } from './commands/handlers/send-verify-email.command.handler';
import { ResetPasswordEmailVerification } from './entities/reset-password-email-verification.entity';
import { SendResetPasswordEmailCommandHandler } from './commands/handlers/send-reset-password-email.command.handler';

const CommandHandlers = [SendVerifyEmailCommandHandler, SendResetPasswordEmailCommandHandler];
const EventHandlers = [SendSignupEmailEventHandler];

@Module({
  imports: [TypeOrmModule.forFeature([User, SignupEmailVerification, ResetPasswordEmailVerification])],
  controllers: [EmailController],
  providers: [EmailService, ...CommandHandlers, ...EventHandlers],
})
export class EmailModule {}
