export class VerboseLogEvent {
  constructor(readonly context: string, readonly message: string, readonly value?: object) {}

  toJSONString(): string {
    return JSON.stringify(
      {
        context: this.context,
        message: this.message,
        value: this.value,
      },
      null,
      2,
    );
  }
}
