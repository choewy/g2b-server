import { OnEvent } from '@choewy/nestjs-event';
import { Injectable } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UpdatePasswordEvent } from './events';

@Injectable()
export class AuthEventHandler {
  constructor(private readonly authService: AuthService) {}

  @OnEvent(UpdatePasswordEvent)
  async handleUpdatePasswordEvent(event: UpdatePasswordEvent) {
    return this.authService.updatePassword(event.user, event.password);
  }
}
