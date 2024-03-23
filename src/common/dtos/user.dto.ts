import { ApiResponseProperty } from '@nestjs/swagger';

import { UserEntity } from '../entities';

export class UserDto {
  @ApiResponseProperty({ type: String, format: 'email' })
  email: string;

  @ApiResponseProperty({ type: String })
  name: string;

  @ApiResponseProperty({ type: Boolean })
  verified: boolean;

  @ApiResponseProperty({ type: Date })
  createdAt: Date;

  constructor(user: UserEntity) {
    this.email = user.email;
    this.name = user.name;
    this.verified = user.verified;
    this.createdAt = user.createdAt;
  }
}
