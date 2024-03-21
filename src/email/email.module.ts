import { EmailVerificationEntity } from '@common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailVerificationEntity])],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
