export class WarnLogEvent {
  constructor(readonly context: string, readonly message: string, readonly value?: object, readonly error?: unknown) {}

  toJSONString(): string {
    return JSON.stringify(
      {
        context: this.context,
        message: this.message,
        value: this.value,
        error: this.error,
      },
      null,
      2,
    );
  }
}
