import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqUser } from 'src/auth/decorators';
import { JwtAuthGuard } from 'src/auth/guards';
import { UserTokenPayload } from 'src/auth/interfaces';

import { EmailService } from './email.service';
import { GetEmailExpiresInQuery } from './queries';

@ApiTags('이메일')
@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  @ApiOperation({ summary: '이메일 인증 코드 잔여 시간 확인' })
  @ApiOkResponse({ type: Number })
  async getEmailExpiresIn(@ReqUser() user: UserTokenPayload, @Param() param: GetEmailExpiresInQuery) {
    return this.emailService.getEmailExpiresIn(user.id, param.type);
  }

  @Post('verify')
  async verifyEmail() {
    return;
  }
}
