import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length, MinLength } from 'class-validator';

export class ResetPasswordCommand {
  @ApiProperty({ type: String, format: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @Length(16, 16)
  tempPassword: string;

  @ApiProperty({ type: String })
  @MinLength(1)
  newPassword: string;

  @ApiProperty({ type: String })
  @MinLength(1)
  confirmPassword: string;
}
