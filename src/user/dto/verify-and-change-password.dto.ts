import { IsEmail, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class VerifyResetPasswordDto {
  @ApiProperty({ type: String, format: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  tempPassword: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  confirmPassword: string;
}
