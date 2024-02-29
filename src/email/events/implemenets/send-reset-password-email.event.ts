export class SendResetPasswordEmailEvent {
  constructor(readonly email: string, readonly tempPassword: string) {}
}
