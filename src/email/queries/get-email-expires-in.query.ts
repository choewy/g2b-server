import { EmailVerificationType } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class GetEmailExpiresInQuery {
  @ApiProperty({ type: String, enum: EmailVerificationType })
  @IsEnum(EmailVerificationType)
  type: EmailVerificationType;
}
