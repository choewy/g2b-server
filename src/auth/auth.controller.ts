import { UserDto } from '@common';
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { SignInCommand, SignUpCommand } from './commands';

@ApiTags('인증/인가')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @TODO guard
   * @TODO params(id)
   * */
  @Get()
  @ApiOperation({ summary: '인가' })
  @ApiOkResponse({ type: UserDto })
  async auth(@Res({ passthrough: true }) res: Response) {
    return this.authService.getUser(res, 1);
  }

  @Post('signin')
  @ApiOperation({ summary: '로그인' })
  @ApiCreatedResponse({ type: UserDto })
  async signin(@Res({ passthrough: true }) res: Response, @Body() command: SignInCommand) {
    return this.authService.signIn(res, command);
  }

  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse({ type: UserDto })
  async signup(@Res({ passthrough: true }) res: Response, @Body() command: SignUpCommand) {
    return this.authService.signUp(res, command);
  }

  @Post('signout')
  @ApiOperation({ summary: '로그아웃' })
  @ApiCreatedResponse({ type: null })
  async signout(@Res({ passthrough: true }) res: Response) {
    return;
  }
}
