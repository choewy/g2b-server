import { IsEmail, Length, MinLength } from 'class-validator';

export class ResetPasswordCommand {
  @IsEmail()
  email: string;

  @Length(16, 16)
  tempPassword: string;

  @MinLength(1)
  newPassword: string;

  @MinLength(1)
  confirmPassword: string;
}
