import { ApiResponseProperty } from '@nestjs/swagger';

import { User } from '../entities/user.entity';

export class UserDto {
  @ApiResponseProperty({ type: String, format: 'email' })
  email: string;

  @ApiResponseProperty({ type: String })
  name: string;

  constructor(user: User) {
    this.email = user.email;
    this.name = user.name;
  }
}
