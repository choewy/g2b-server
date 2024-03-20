import { UserEntity } from '@common';
import { ApiResponseProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiResponseProperty({ type: String, format: 'email' })
  email: string;

  @ApiResponseProperty({ type: String })
  name: string;

  @ApiResponseProperty({ type: Boolean })
  verified: boolean;

  constructor(user: UserEntity) {
    this.email = user.email;
    this.name = user.name;
    this.verified = user.verified;
  }
}
