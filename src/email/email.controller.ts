import { Controller, Post } from '@nestjs/common';

@Controller('email')
export class EmailController {
  @Post()
  async sendEmail() {
    return;
  }

  @Post('verify')
  async verifyEmail() {
    return;
  }
}
