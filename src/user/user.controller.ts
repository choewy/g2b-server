import { Response } from 'express';

import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/jwt/jwt.guard';
import { ReqUserID } from 'src/decorators/req-id.param';

import { GetUserWithAuthQueryHandler } from './queries/handlers/get-user-with-auth.query.handler';
import { GetUserWithAuthQuery } from './queries/implements/get-user-with-auth.query';
import { GetUserWithSignInQueryHandler } from './queries/handlers/get-user-with-signin.query.handler';
import { GetUserWithSignInQuery } from './queries/implements/get-user-with-signin.query';
import { CreateUserCommandHandler } from './commands/handlers/create-user.command.handler';
import { CreateUserCommand } from './commands/implements/create-user.command';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@ApiTags('사용자')
@Controller('users')
export class UserController {
  constructor(
    private readonly getUserWithAuthQueryHandler: GetUserWithAuthQueryHandler,
    private readonly getUserWithSignInQueryHandler: GetUserWithSignInQueryHandler,
    private readonly createUserCommandHandler: CreateUserCommandHandler,
  ) {}

  @Get('auth')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '인가' })
  async auth(@Res({ passthrough: true }) res: Response, @ReqUserID() userId: number) {
    return this.getUserWithAuthQueryHandler.execute(new GetUserWithAuthQuery(res, userId));
  }

  @Post('signin')
  @ApiOperation({ summary: '로그인' })
  async signIn(@Res({ passthrough: true }) res: Response, @Body() body: SignInDto) {
    return this.getUserWithSignInQueryHandler.execute(new GetUserWithSignInQuery(res, body.email, body.password));
  }

  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  async signUp(@Res({ passthrough: true }) res: Response, @Body() body: SignUpDto) {
    return this.createUserCommandHandler.execute(new CreateUserCommand(res, body.email, body.name, body.password, body.confirmPassword));
  }
}
