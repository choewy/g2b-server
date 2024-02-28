export class BidsError extends Error {
  cause?: unknown;

  constructor(e: unknown) {
    super();

    this.name = BidsError.name;
    this.message = '입찰 공고를 불러올 수 없습니다.';
    this.cause = e;

    if (e instanceof Error) {
      this.cause = {
        name: e.name,
        message: e.message,
      };
    }
  }
}
