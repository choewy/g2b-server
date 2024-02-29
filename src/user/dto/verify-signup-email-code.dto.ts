import { IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class VerifySignupEmailCodeDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  code: string;
}
