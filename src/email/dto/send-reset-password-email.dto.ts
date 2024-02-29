import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendResetPasswordEmailDto {
  @ApiProperty({ type: String, format: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
