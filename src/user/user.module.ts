import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { GetUserWithAuthQueryHandler } from './queries/handlers/get-user-with-auth.query.handler';
import { GetUserWithSignInQueryHandler } from './queries/handlers/get-user-with-signin.query.handler';
import { CreateUserCommandHandler } from './commands/handlers/create-user.command.handler';

const QueryHandlers = [GetUserWithAuthQueryHandler, GetUserWithSignInQueryHandler];
const CommandHandlers = [CreateUserCommandHandler];

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class UserModule {}
