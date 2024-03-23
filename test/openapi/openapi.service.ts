/* eslint-disable @typescript-eslint/no-unused-vars */

import { SearchType } from '@common';
import { OpenApiParams } from 'src/openapi/implements';
import { OpenApiBidsItem, OpenApiHrcsItem, OpenApiEndPoint, OpenApiResponseBody, OpenApiFilterRegExp } from 'src/openapi/interfaces';
import { OpenApiService } from 'src/openapi/openapi.service';

export class TestOpenApiService extends OpenApiService {
  createEndPoints(type: SearchType, types: number[]) {
    return super.createEndPoints(type, types);
  }

  getUrl(type: SearchType): string {
    return super.getUrl(type);
  }

  async getItem<T = OpenApiBidsItem | OpenApiHrcsItem>(
    type: SearchType,
    endPoint: OpenApiEndPoint,
    params: OpenApiParams,
  ): Promise<OpenApiResponseBody<T>> {
    return {
      pageNo: 1,
      numOfRows: 0,
      totalCount: 0,
      items: [],
    };
  }

  async getItems<T = OpenApiBidsItem | OpenApiHrcsItem>(
    type: SearchType,
    types: number[],
    startDate: string,
    endDate: string,
  ): Promise<T[]> {
    return [];
  }

  async createKeywordRegExp(userId: number): Promise<OpenApiFilterRegExp> {
    return { include: null, exclude: null };
  }
}
