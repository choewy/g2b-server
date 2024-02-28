import { Response } from 'express';
import { hashSync } from 'bcrypt';
import { plainToInstance } from 'class-transformer';

import { User } from 'src/user/entities/user.entity';
import { SignUpDto } from 'src/user/dto/sign-up.dto';

export class CreateUserCommand {
  constructor(readonly res: Response, readonly body: SignUpDto) {}

  toEntity(): User {
    return plainToInstance(User, {
      name: this.body.name,
      email: this.body.email,
      password: hashSync(this.body.password, 10),
    });
  }
}
