import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class VerifyEmailCommand {
  @ApiProperty({ type: String })
  @Length(6, 6)
  code: string;
}
