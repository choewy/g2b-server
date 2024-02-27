import { hashSync } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';

import { User } from 'src/user/entities/user.entity';

export class CreateUserCommand {
  constructor(
    readonly res: Response,
    readonly email: string,
    readonly name: string,
    readonly password: string,
    readonly confirmPassword: string,
  ) {}

  toEntity(): User {
    return plainToInstance(User, {
      name: this.name,
      email: this.email,
      password: hashSync(this.password, 10),
    });
  }
}
