import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { GetUserWithAuthQueryHandler } from './queries/handlers/get-user-with-auth.query.handler';
import { GetUserWithSignInQueryHandler } from './queries/handlers/get-user-with-signin.query.handler';
import { CreateUserCommandHandler } from './commands/handlers/create-user.command.handler';
import { VerifySignupEmailCodeCommandHandler } from './commands/handlers/verify-signup-email-code.command.handler';
import { SignupEmailVerification } from 'src/email/entities/signup-email-verification.entity';
import { ResetPasswordEmailVerification } from 'src/email/entities/reset-password-email-verification.entity';
import { VerifyResetPasswordCommandHandler } from './commands/handlers/verify-reset-password.command.handler';

const QueryHandlers = [GetUserWithAuthQueryHandler, GetUserWithSignInQueryHandler];
const CommandHandlers = [CreateUserCommandHandler, VerifySignupEmailCodeCommandHandler, VerifyResetPasswordCommandHandler];

@Module({
  imports: [TypeOrmModule.forFeature([User, SignupEmailVerification, ResetPasswordEmailVerification])],
  controllers: [UserController],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class UserModule {}
