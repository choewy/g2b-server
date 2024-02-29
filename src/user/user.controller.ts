import { Response } from 'express';

import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ReqUserID } from 'src/decorators/req-user-id.param';
import { JwtGuard } from 'src/jwt/jwt.guard';
import { JwtService } from 'src/jwt/jwt.service';

import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UserDto } from './dto/user.dto';

import { GetUserWithAuthQueryHandler } from './queries/handlers/get-user-with-auth.query.handler';
import { GetUserWithAuthQuery } from './queries/implements/get-user-with-auth.query';
import { GetUserWithSignInQueryHandler } from './queries/handlers/get-user-with-signin.query.handler';
import { GetUserWithSignInQuery } from './queries/implements/get-user-with-signin.query';
import { CreateUserCommandHandler } from './commands/handlers/create-user.command.handler';
import { CreateUserCommand } from './commands/implements/create-user.command';
import { VerifySignupEmailCodeDto } from './dto/verify-signup-email-code.dto';
import { VerifySignupEmailCodeCommandHandler } from './commands/handlers/verify-signup-email-code.command.handler';
import { VerifySignupEmailCodeCommand } from './commands/implements/verify-signup-email-code.command';
import { VerifyResetPasswordCommandHandler } from './commands/handlers/verify-reset-password.command.handler';
import { VerifyResetPasswordCommand } from './commands/implements/verify-reset-password.command';
import { VerifyResetPasswordDto } from './dto/verify-and-change-password.dto';

@ApiTags('사용자')
@Controller('users')
export class UserController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly getUserWithAuthQueryHandler: GetUserWithAuthQueryHandler,
    private readonly getUserWithSignInQueryHandler: GetUserWithSignInQueryHandler,
    private readonly createUserCommandHandler: CreateUserCommandHandler,
    private readonly verifySignupEmailCodeCommandHandler: VerifySignupEmailCodeCommandHandler,
    private readonly verifyResetPasswordCommandHandler: VerifyResetPasswordCommandHandler,
  ) {}

  @Get('auth')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '인가' })
  @ApiOkResponse({ type: UserDto })
  async auth(@Res({ passthrough: true }) res: Response, @ReqUserID() userId: number) {
    return this.getUserWithAuthQueryHandler.execute(new GetUserWithAuthQuery(res, userId));
  }

  @Post('signin')
  @ApiOperation({ summary: '로그인' })
  @ApiCreatedResponse({ type: UserDto })
  async signIn(@Res({ passthrough: true }) res: Response, @Body() body: SignInDto) {
    return this.getUserWithSignInQueryHandler.execute(new GetUserWithSignInQuery(res, body));
  }

  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse({ type: UserDto })
  async signUp(@Res({ passthrough: true }) res: Response, @Body() body: SignUpDto) {
    return this.createUserCommandHandler.execute(new CreateUserCommand(res, body));
  }

  @Post('signout')
  @ApiOperation({ summary: '로그아웃' })
  @ApiCreatedResponse({ type: null })
  async signOut(@Res({ passthrough: true }) res: Response) {
    return this.jwtService.deleteTokens(res);
  }

  @Post('verify/email')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '이메일 코드 인증' })
  @ApiCreatedResponse({ type: UserDto })
  async verifyEmailCode(@ReqUserID() userId: number, @Body() body: VerifySignupEmailCodeDto) {
    return this.verifySignupEmailCodeCommandHandler.execute(new VerifySignupEmailCodeCommand(userId, body.code));
  }

  @Post('verify/reset-password')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '임시 비밀번호 인증 및 비밀번호 재설정' })
  @ApiCreatedResponse({ type: UserDto })
  async verifyResetPassword(@Res({ passthrough: true }) res: Response, @Body() body: VerifyResetPasswordDto) {
    return this.verifyResetPasswordCommandHandler.execute(new VerifyResetPasswordCommand(res, body));
  }
}
