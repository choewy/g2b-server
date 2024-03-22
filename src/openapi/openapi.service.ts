import { OPEN_API_CONFIG, OpenApiOption, SearchType } from '@common';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

import { OpenApiError, OpenApiParams } from './implements';
import { OpenApiBidsItem, OpenApiEndPoint, OpenApiHrcsItem, OpenApiResponse } from './interfaces';

@Injectable()
export class OpenApiService {
  constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {}

  protected createEndPoints(type: SearchType, types: number[]): OpenApiEndPoint[] {
    let endPoints: OpenApiEndPoint[];

    switch (type) {
      case SearchType.Bids:
        endPoints = [
          { name: '물품', path: 'getBidPblancListInfoThngPPSSrch01' },
          { name: '공사', path: 'getBidPblancListInfoCnstwkPPSSrch01' },
          { name: '용역', path: 'getBidPblancListInfoServcPPSSrch01' },
          { name: '외자', path: 'getBidPblancListInfoFrgcptPPSSrch01' },
          { name: '기타', path: 'getBidPblancListInfoEtcPPSSrch01' },
        ];
        break;

      case SearchType.Hrcs:
        endPoints = [
          { name: '물품', path: 'getPublicPrcureThngInfoThngPPSSrch' },
          { name: '공사', path: 'getPublicPrcureThngInfoCnstwkPPSSrch' },
          { name: '용역', path: 'getPublicPrcureThngInfoServcPPSSrch' },
          { name: '외자', path: 'getPublicPrcureThngInfoFrgcptPPSSrch' },
        ];
        break;
    }

    return types.length === 0 ? endPoints : endPoints.filter((_, i) => types.includes(i));
  }

  protected getUrl(type: SearchType) {
    const config = this.configService.get<OpenApiOption>(OPEN_API_CONFIG);

    switch (type) {
      case SearchType.Bids:
        return config.bidsUrl;

      case SearchType.Hrcs:
        return config.hrcsUrl;
    }
  }

  async getItem<T = OpenApiBidsItem | OpenApiHrcsItem>(type: SearchType, endPoint: OpenApiEndPoint, params: OpenApiParams) {
    return lastValueFrom(this.httpService.get<OpenApiResponse<T>>([this.getUrl(type), endPoint.path].join('/'), { params }))
      .then((res) => res.data.response.body)
      .catch((e) => {
        throw new OpenApiError(type, e);
      });
  }

  async getItems<T = OpenApiBidsItem | OpenApiHrcsItem>(type: SearchType, types: number[], startDate: string, endDate: string) {
    const config = this.configService.get<OpenApiOption>(OPEN_API_CONFIG);
    const endPoints = this.createEndPoints(type, types);
    const items: T[] = [];

    let totalCount = 0;
    let currentCount = 0;

    for (const endPoint of endPoints) {
      const params = new OpenApiParams(config.apiKey, startDate, endDate);

      do {
        const body = await this.getItem<T>(type, endPoint, params);

        if (Array.isArray(body.items) === false) {
          break;
        }

        totalCount = body.totalCount;
        currentCount = body.pageNo * body.numOfRows;

        for (const item of body.items) {
          items.push({ ...item, endPoint });
        }

        params.nextPage();
      } while (totalCount > currentCount);
    }

    return items;
  }
}
