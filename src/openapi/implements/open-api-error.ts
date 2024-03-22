import { SearchType } from '@common';
import { AxiosError } from 'axios';

export class OpenApiError extends Error {
  constructor(type: SearchType, e: unknown) {
    super();

    switch (type) {
      case SearchType.Bids:
        this.message = '입찰공고를 수집하는 과정에 문제가 발생하였습니다.';
        break;

      case SearchType.Hrcs:
        this.message = '사전규격을 수집하는 과정에 문제가 발생하였습니다.';
        break;
    }

    this.cause = e;

    if (e instanceof Error) {
      this.cause = {
        name: e.name,
        message: e.message,
      };
    }

    if (e instanceof AxiosError) {
      this.cause = e.response?.data ?? this.cause;
    }
  }
}
