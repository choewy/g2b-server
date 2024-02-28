import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { ConfigFactory } from 'src/config/config.factory';

import { HrcsEndPoint, HrcsItem, HrcsResponseBody, HrcsResponse } from './interfaces';
import { HrcsParamsDto } from './dto/hrcs-params.dto';
import { HrcsError } from './hrcs.error';

@Injectable()
export class HrcsService {
  constructor(private readonly httpService: HttpService, private readonly configFactory: ConfigFactory) {}

  private getEndPoints(types: number[]): HrcsEndPoint[] {
    const endPoints: HrcsEndPoint[] = [
      { name: '물품', path: 'getPublicPrcureThngInfoThngPPSSrch' },
      { name: '공사', path: 'getPublicPrcureThngInfoCnstwkPPSSrch' },
      { name: '용역', path: 'getPublicPrcureThngInfoServcPPSSrch' },
      { name: '외자', path: 'getPublicPrcureThngInfoFrgcptPPSSrch' },
    ];

    return types.length === 0 ? endPoints : endPoints.filter((_, i) => types.includes(i));
  }

  async getItemsOnce(endPoint: HrcsEndPoint, params: HrcsParamsDto): Promise<HrcsResponseBody> {
    const options = this.configFactory.g2bApiOptions;
    const url = [options.url.hrcs, endPoint.path].join('/');

    return lastValueFrom(this.httpService.get<HrcsResponse>(url, { params }))
      .then((res) => res.data.response.body)
      .catch((e) => {
        throw new HrcsError(e);
      });
  }

  async getItemsManyTimes(types: number[], startDate: string, endDate: string): Promise<HrcsItem[]> {
    const endPoints = this.getEndPoints(types);

    let totalCount = 0;
    let currentCount = 0;

    const items: HrcsItem[] = [];

    for (const endPoint of endPoints) {
      const options = this.configFactory.g2bApiOptions;
      const params = new HrcsParamsDto(options.key, startDate, endDate);
      do {
        const body = await this.getItemsOnce(endPoint, params);

        totalCount = body.totalCount;
        currentCount = body.pageNo * body.numOfRows;

        for (const item of body.items) {
          item.endPoint = endPoint;
          items.push(item);
        }

        params.nextPage();
      } while (totalCount > currentCount);
    }

    return items;
  }
}
