import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendResetPasswordEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
