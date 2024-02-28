import { lastValueFrom } from 'rxjs';

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { ConfigFactory } from 'src/config/config.factory';

import { BidsEndPoint, BidsItem, BidsResponseBody, BidsResponse } from './interfaces';
import { BidsParamsDto } from './dto/bids-params.dto';
import { BidsError } from './bids.error';

@Injectable()
export class BidsService {
  constructor(private readonly httpService: HttpService, private readonly configFactory: ConfigFactory) {}

  private getEndPoints(types: number[]): BidsEndPoint[] {
    const endPoints: BidsEndPoint[] = [
      { name: '물품', path: 'getBidPblancListInfoThngPPSSrch01' },
      { name: '공사', path: 'getBidPblancListInfoCnstwkPPSSrch01' },
      { name: '용역', path: 'getBidPblancListInfoServcPPSSrch01' },
      { name: '외자', path: 'getBidPblancListInfoFrgcptPPSSrch01' },
      { name: '기타', path: 'getBidPblancListInfoEtcPPSSrch01' },
    ];

    return types.length === 0 ? endPoints : endPoints.filter((_, i) => types.includes(i));
  }

  async getItemsOnce(endPoint: BidsEndPoint, params: BidsParamsDto): Promise<BidsResponseBody> {
    const options = this.configFactory.g2bApiOptions;
    const url = [options.url.bids, endPoint.path].join('/');

    return lastValueFrom(this.httpService.get<BidsResponse>(url, { params }))
      .then((res) => res.data.response.body)
      .catch((e) => {
        throw new BidsError(e);
      });
  }

  async getItemsManyTimes(types: number[], startDate: string, endDate: string): Promise<BidsItem[]> {
    const endPoints = this.getEndPoints(types);

    let totalCount = 0;
    let currentCount = 0;

    const items: BidsItem[] = [];

    for (const endPoint of endPoints) {
      const options = this.configFactory.g2bApiOptions;
      const params = new BidsParamsDto(options.key, startDate, endDate);
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
