import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class SignUpCommand {
  @ApiProperty({ type: String, format: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @MinLength(1)
  name: string;

  @ApiProperty({ type: String })
  @MinLength(1)
  password: string;

  @ApiProperty({ type: String })
  @MinLength(1)
  confirmPassword: string;
}
