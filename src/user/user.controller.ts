import { Response } from 'express';

import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { CreateUserCommandHandler } from './commands/handlers/create-user.command.handler';
import { CreateUserCommand } from './commands/implements/create-user.command';

@ApiTags('사용자')
@Controller('users')
export class UserController {
  constructor(private readonly createUserCommandHandler: CreateUserCommandHandler) {}

  @Post('signin')
  @ApiOperation({ summary: '로그인' })
  async signIn(@Res({ passthrough: true }) res: Response, @Body() body: SignInDto) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  async signUp(@Res({ passthrough: true }) res: Response, @Body() body: SignUpDto) {
    return this.createUserCommandHandler.execute(new CreateUserCommand(res, body.email, body.name, body.password, body.confirmPassword));
  }
}
