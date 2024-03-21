import { Length } from 'class-validator';

export class VerifyEmailCommand {
  @Length(6, 6)
  code: string;
}
