import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';

@ApiTags('회원')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @TODO guard
   * @TODO params(id)
   * */
  @Get('auth')
  async getUser(id: number) {
    return this.userService.getUser(id);
  }
}
