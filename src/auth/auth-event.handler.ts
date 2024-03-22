import { OnEvent } from '@choewy/nestjs-event';
import { Injectable } from '@nestjs/common';

import { AuthService } from './auth.service';
import { DeleteTokensEvent, SetTokensEvent, UpdatePasswordEvent, VerifyAccessTokenEvent, VerifyRefreshTokenEvent } from './events';

@Injectable()
export class AuthEventHandler {
  constructor(private readonly authService: AuthService) {}

  @OnEvent(VerifyAccessTokenEvent)
  async handleVerifyAccessTokenEvent(event: VerifyAccessTokenEvent) {
    return this.authService.verifyAccessToken(event.req);
  }

  @OnEvent(VerifyRefreshTokenEvent)
  async handleVerifyRefreshTokenEvent(event: VerifyRefreshTokenEvent) {
    return this.authService.verifyRefreshToken(event.req);
  }

  @OnEvent(DeleteTokensEvent)
  async handleDeleteTokensEvent(event: DeleteTokensEvent) {
    return this.authService.deleteTokens(event.res);
  }

  @OnEvent(SetTokensEvent)
  async handleSetTokensEvent(event: SetTokensEvent) {
    this.authService.setAccessToken(event.res, event.userTokenPayload.id, event.userTokenPayload.email);
    this.authService.setRefreshToken(event.res, event.userTokenPayload.id, event.userTokenPayload.email);
  }

  @OnEvent(UpdatePasswordEvent)
  async handleUpdatePasswordEvent(event: UpdatePasswordEvent) {
    return this.authService.updatePassword(event.user, event.password);
  }
}
