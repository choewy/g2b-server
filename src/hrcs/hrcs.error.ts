export class HrcsError extends Error {
  cause?: unknown;

  constructor(e: unknown) {
    super();

    this.name = HrcsError.name;
    this.message = '사전규격 공고를 불러올 수 없습니다.';
    this.cause = e;
  }
}
