import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

import { JwtGuard } from 'src/jwt/jwt.guard';
import { ReqUserID } from 'src/decorators/req-user-id.param';
import { ReqUserEmail } from 'src/decorators/req-user-email.param';

import { SendSignupEmailCommandHandler } from './commands/handlers/send-signup-email.command.handler';
import { SendSignupEmailCommand } from './commands/implemenets/send-signup-email.command';
import { SendResetPasswordEmailCommandHandler } from './commands/handlers/send-reset-password-email.command.handler';
import { SendResetPasswordEmailDto } from './dto/send-reset-password-email.dto';
import { SendResetPasswordEmailCommand } from './commands/implemenets/send-reset-password-email.command';

@Controller('email')
export class EmailController {
  constructor(
    private readonly sendSignupEmailCommandHandler: SendSignupEmailCommandHandler,
    private readonly sendResetPasswordEmailCommandHandler: SendResetPasswordEmailCommandHandler,
  ) {}

  @Post('signup')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '회원가입 인증 메일 발송' })
  @ApiCreatedResponse({ type: null })
  async sendSignupEmail(@ReqUserID() userId: number, @ReqUserEmail() email: string) {
    return this.sendSignupEmailCommandHandler.execute(new SendSignupEmailCommand(userId, email));
  }

  @Post('reset-password')
  @ApiOperation({ summary: '비밀번호 초기화 인증 메일 발송' })
  @ApiCreatedResponse({ type: null })
  async sendResetPasswordEmail(@Body() body: SendResetPasswordEmailDto) {
    return this.sendResetPasswordEmailCommandHandler.execute(new SendResetPasswordEmailCommand(body.email));
  }
}
