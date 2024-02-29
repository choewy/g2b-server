export class SendVerifyEmailEvent {
  constructor(readonly email: string, readonly code: string) {}
}
