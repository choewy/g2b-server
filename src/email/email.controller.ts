import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/jwt/jwt.guard';
import { ReqUserID } from 'src/decorators/req-user-id.param';
import { ReqUserEmail } from 'src/decorators/req-user-email.param';

import { SendVerifyEmailCommandHandler } from './commands/handlers/send-verify-email.command.handler';
import { SendVerifyEmailCommand } from './commands/implemenets/send-verify-email.command';
import { SendResetPasswordEmailCommandHandler } from './commands/handlers/send-reset-password-email.command.handler';
import { SendResetPasswordEmailDto } from './dto/send-reset-password-email.dto';
import { SendResetPasswordEmailCommand } from './commands/implemenets/send-reset-password-email.command';
import { GetVerifyEmailRemainSecondsQueryHandler } from './queries/handlers/get-verify-email-remain-seconds.query.handler';
import { GetVerifyEmailRemainSecondsQuery } from './queries/events/get-verify-email-remain-seconds.query';

@ApiTags('이메일 발송')
@Controller('email')
export class EmailController {
  constructor(
    private readonly getVerifyEmailRemainSecondsQueryHandler: GetVerifyEmailRemainSecondsQueryHandler,
    private readonly sendVerifyEmailCommandHandler: SendVerifyEmailCommandHandler,
    private readonly sendResetPasswordEmailCommandHandler: SendResetPasswordEmailCommandHandler,
  ) {}

  @Get('verify/seconds')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '인증 메일 잔여 시간 확인' })
  @ApiOkResponse({ type: Number })
  async getVerifySeconds(@ReqUserID() userId: number) {
    return this.getVerifyEmailRemainSecondsQueryHandler.execute(new GetVerifyEmailRemainSecondsQuery(userId));
  }

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
