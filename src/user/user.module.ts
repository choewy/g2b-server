import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { CreateUserCommandHandler } from './commands/handlers/create-user.command.handler';

const CommandHandlers = [CreateUserCommandHandler];

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [...CommandHandlers],
})
export class UserModule {}
