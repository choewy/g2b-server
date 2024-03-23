import { EmailVerificationEntity, UserEntity } from '@common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailEventHandler } from './email-event.handler';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, EmailVerificationEntity])],
  controllers: [EmailController],
  providers: [EmailService, EmailEventHandler],
})
export class EmailModule {}
