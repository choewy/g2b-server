import { UserDto } from '@common';
import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IgnoreJwtGuardError, ReqUser } from 'src/auth/decorators';
import { JwtAuthGuard } from 'src/auth/guards';
import { UserTokenPayload } from 'src/auth/interfaces';

import { ResetPasswordCommand, SendResetPasswordEmailCommand, VerifyEmailCommand } from './commands';
import { EmailService } from './email.service';

@ApiTags('이메일')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('signup')
  @UseGuards(JwtAuthGuard)
  @IgnoreJwtGuardError()
  @ApiOperation({ summary: '회원가입 인증 메일 코드 잔여 시간 확인' })
  @ApiOkResponse({ type: Number })
  async getEmailExpiresIn(@ReqUser() user: UserTokenPayload) {
    return this.emailService.getEmailExpiresIn(user.id);
  }

  @Post('send/signup')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '회원가입 인증 메일 발송' })
  @ApiCreatedResponse({ type: null })
  async sendSignUpVerificationEmail(@ReqUser() user: UserTokenPayload) {
    return this.emailService.sendSignUpVerificationEmail(user.id);
  }

  @Post('send/reset-password')
  @ApiOperation({ summary: '임시 비밀번호 발급 메일 발송' })
  @ApiCreatedResponse({ type: null })
  async sendResetPasswordVerificationEmail(@Body() command: SendResetPasswordEmailCommand) {
    return this.emailService.sendResetPasswordVerificationEmail(command.email);
  }

  @Patch('verify/signup')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '이메일 인증' })
  @ApiOkResponse({ type: UserDto })
  async verifySignUpEmail(@ReqUser() user: UserTokenPayload, @Body() command: VerifyEmailCommand) {
    return this.emailService.verifyEmail(user.id, command);
  }

  @Patch('verify/reset-password')
  @ApiOperation({ summary: '비밀번호 재설정' })
  @ApiOkResponse({ type: UserDto })
  async verifyResetPasswordEmail(@Body() command: ResetPasswordCommand) {
    return this.emailService.verifyResetPasswordEmail(command);
  }
}
