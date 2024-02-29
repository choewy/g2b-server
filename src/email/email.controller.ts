import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/jwt/jwt.guard';
import { ReqUserID } from 'src/decorators/req-user-id.param';
import { ReqUserEmail } from 'src/decorators/req-user-email.param';

import { SendVerifyEmailCommandHandler } from './commands/handlers/send-verify-email.command.handler';
import { SendVerifyEmailCommand } from './commands/implemenets/send-verify-email.command';
import { SendResetPasswordEmailCommandHandler } from './commands/handlers/send-reset-password-email.command.handler';
import { SendResetPasswordEmailDto } from './dto/send-reset-password-email.dto';
import { SendResetPasswordEmailCommand } from './commands/implemenets/send-reset-password-email.command';

@ApiTags('이메일 발송')
@Controller('email')
export class EmailController {
  constructor(
    private readonly sendVerifyEmailCommandHandler: SendVerifyEmailCommandHandler,
    private readonly sendResetPasswordEmailCommandHandler: SendResetPasswordEmailCommandHandler,
  ) {}

  @Post('verify')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '인증 메일 발송' })
  @ApiCreatedResponse({ type: null })
  async sendVerifyEmail(@ReqUserID() userId: number, @ReqUserEmail() email: string) {
    return this.sendVerifyEmailCommandHandler.execute(new SendVerifyEmailCommand(userId, email));
  }

  @Post('reset-password')
  @ApiOperation({ summary: '비밀번호 초기화 인증 메일 발송' })
  @ApiCreatedResponse({ type: null })
  async sendResetPasswordEmail(@Body() body: SendResetPasswordEmailDto) {
    return this.sendResetPasswordEmailCommandHandler.execute(new SendResetPasswordEmailCommand(body.email));
  }
}
