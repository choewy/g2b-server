import { EventPublisher } from '@choewy/nestjs-event';
import { KeywordEntity, KeywordType, OPEN_API_CONFIG, OpenApiOption, SearchType } from '@common';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { CreateExcelEvent } from 'src/excel/events';
import { SendSearchCountsEvent, SendSearchEndEvent, SendSearchExcelEvent } from 'src/search/events';
import { Repository } from 'typeorm';

import { OpenApiEndDto, OpenApiItemCountsDto } from './dtos';
import { OpenApiBidsFilteredItem, OpenApiError, OpenApiHrcsFilteredItem, OpenApiParams } from './implements';
import { OpenApiBidsItem, OpenApiEndPoint, OpenApiFilterRegExp, OpenApiHrcsItem, OpenApiResponse } from './interfaces';

@Injectable()
export class OpenApiService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(KeywordEntity)
    private readonly keywordRepository: Repository<KeywordEntity>,
  ) {}

  protected createEndPoints(type: SearchType, types: number[]): OpenApiEndPoint[] {
    let endPoints: OpenApiEndPoint[];

    switch (type) {
      case SearchType.Bids:
        endPoints = [
          { name: '물품', path: 'getBidPblancListInfoThngPPSSrch02' },
          { name: '공사', path: 'getBidPblancListInfoCnstwkPPSSrch02' },
          { name: '용역', path: 'getBidPblancListInfoServcPPSSrch02' },
          { name: '외자', path: 'getBidPblancListInfoFrgcptPPSSrch02' },
          { name: '기타', path: 'getBidPblancListInfoEtcPPSSrch02' },
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

  protected async getItem<T = OpenApiBidsItem | OpenApiHrcsItem>(type: SearchType, endPoint: OpenApiEndPoint, params: OpenApiParams) {
    console.log(endPoint);

    return lastValueFrom(this.httpService.get<OpenApiResponse<T>>([this.getUrl(type), endPoint.path].join('/'), { params }))
      .then((res) => {
        console.log(res.data);
        return res.data.response.body;
      })
      .catch((e) => {
        throw new OpenApiError(type, e);
      });
  }

  protected async getItems<T = OpenApiBidsItem | OpenApiHrcsItem>(type: SearchType, types: number[], startDate: string, endDate: string) {
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

  protected async createKeywordRegExp(userId: number): Promise<OpenApiFilterRegExp> {
    const keywords = await this.keywordRepository.find({ where: { user: { id: userId } } });
    const includeKeywords = keywords.filter(({ type }) => type === KeywordType.Include).map(({ text }) => text);
    const excludeKeywords = keywords.filter(({ type }) => type === KeywordType.Exclude).map(({ text }) => text);
    const includeKeywordRegExp = includeKeywords.length > 0 ? new RegExp(includeKeywords.join('|')) : null;
    const excludeKeywordRegExp = excludeKeywords.length > 0 ? new RegExp(excludeKeywords.join('|')) : null;
    return { include: includeKeywordRegExp, exclude: excludeKeywordRegExp };
  }

  protected filterBidsItems(items: OpenApiBidsItem[], regExp: OpenApiFilterRegExp) {
    const filteredItems: OpenApiBidsFilteredItem[] = [];

    while (items.length > 0) {
      const item = new OpenApiBidsFilteredItem(filteredItems.length, items.shift());

      if (regExp.include) {
        const keywords = regExp.include.exec(item.bidNtceNm);

        if (keywords === null) {
          continue;
        }

        item.setKeywords(keywords);
      }

      if (regExp.exclude) {
        const keywords = []
          .concat(regExp.exclude.exec(item.bidNtceNm) ?? [])
          .concat(regExp.exclude.exec(item.ntceInsttNm) ?? [])
          .concat(regExp.exclude.exec(item.dminsttNm) ?? []);

        if (keywords.length > 0) {
          continue;
        }
      }

      filteredItems.push(item);
    }

    return filteredItems;
  }

  protected filterHrcsItems(items: OpenApiHrcsItem[], regExp: OpenApiFilterRegExp) {
    const filteredItems: OpenApiHrcsFilteredItem[] = [];

    while (items.length > 0) {
      const item = new OpenApiHrcsFilteredItem(filteredItems.length, items.shift());

      if (regExp.include) {
        const keywords = regExp.include.exec(item.prdctClsfcNoNm);

        if (keywords === null) {
          continue;
        }

        item.setKeywords(keywords);
      }

      if (regExp.exclude) {
        const keywords = [].concat(regExp.exclude.exec(item.prdctClsfcNoNm) ?? []).concat(regExp.exclude.exec(item.rlDminsttNm) ?? []);

        if (keywords.length > 0) {
          continue;
        }
      }

      filteredItems.push(item);
    }

    return filteredItems;
  }

  protected filterItems<T = OpenApiBidsItem | OpenApiHrcsItem>(type: SearchType, items: T[], regExp: OpenApiFilterRegExp) {
    let filteredItems: Array<OpenApiBidsFilteredItem | OpenApiHrcsFilteredItem> = [];

    switch (type) {
      case SearchType.Bids:
        filteredItems = this.filterBidsItems(items as OpenApiBidsItem[], regExp);
        break;

      case SearchType.Hrcs:
        filteredItems = this.filterHrcsItems(items as OpenApiHrcsItem[], regExp);
        break;
    }

    return filteredItems.sort((x, y) => (x.keywords > y.keywords ? 1 : -1));
  }

  async run(userId: number, type: SearchType, types: number[], startDate: string, endDate: string) {
    const result = new OpenApiEndDto(type);

    try {
      const items = await this.getItems(type, types, startDate, endDate);
      const itemsCount = items.length;

      const regExp = await this.createKeywordRegExp(userId);
      const filteredItems = this.filterItems(type, items, regExp);
      const filteredItemsCount = filteredItems.length;

      const counts = new OpenApiItemCountsDto(type, itemsCount, filteredItemsCount);
      await this.eventPublisher.publish(new SendSearchCountsEvent(userId, counts));

      if (filteredItemsCount > 0) {
        const createExcelEvent = new CreateExcelEvent(userId, type, filteredItems, startDate, endDate);
        const createExcelResult = await this.eventPublisher.publish(createExcelEvent, { throwError: true });
        await this.eventPublisher.publish(new SendSearchExcelEvent(userId, createExcelResult.getFirstValue()));
      }
    } catch (e) {
      result.error = e;
    }

    console.log(result);

    await this.eventPublisher.publish(new SendSearchEndEvent(userId, result));
  }
}
